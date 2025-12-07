#include "DHT.h"
#include "esp_task_wdt.h"
#include <HTTPClient.h>
#include <Preferences.h>
#include <PubSubClient.h>
#include <Update.h>
#include <WiFi.h>
#include <WiFiManager.h>

// ---------------- CONFIG ----------------
const char *firmwareUrl = "https://github.com/amer-maher/esp32_firmware/"
                          "releases/download/esp32/firmware.ino.bin";
const char *versionUrl = "https://raw.githubusercontent.com/amer-maher/"
                         "esp32_firmware/main/version.txt";
const unsigned long updateCheckInterval = 5 * 60 * 1000UL; // كل 5 دقائق

const int pinLed1 = 2;
const int pinLed2 = 4;

// Device UUID لتحديد topic خاص
const char *deviceUUID =
    "550e8400-e29b-41d4-a716-446655440000"; // مثال UUID صالح

Preferences preferences;
String currentFirmwareVersion;
unsigned long lastUpdateCheck = 0;

// ---------------- DHT22 ----------------
#define DHTPIN 5
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ---------------- MQ135 ----------------
const int mq135Pin = 34; // A0

// ---------------- MQTT ----------------
WiFiClient espClient;
PubSubClient mqttClient(espClient);

const char *mqtt_server = "192.168.1.14"; // IP الـ MQTT Broker
const int mqtt_port = 1883;
const char *mqtt_username = "";
const char *mqtt_password = "";

unsigned long lastMQTTConnectAttempt = 0;

// ---------------- WDT ----------------
const int WDT_TIMEOUT_SEC = 30;
bool wdtInitialized = false;

// ---------------- FUNCTION DECLARATIONS ----------------
void connectMQTT();
void mqttCallback(char *topic, byte *message, unsigned int length);
void checkForFirmwareUpdate();
String fetchLatestVersion();
void downloadAndApplyFirmware(String latestVersion);
bool startOTAUpdate(WiFiClient *client, int size, String latestVersion);

// ---------------- SETUP ----------------
void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(pinLed1, OUTPUT);
  pinMode(pinLed2, OUTPUT);
  digitalWrite(pinLed1, LOW);
  digitalWrite(pinLed2, LOW);

  dht.begin();

  preferences.begin("ota", false);
  currentFirmwareVersion = preferences.getString("version", "1.0.1");

  Serial.println("\nBooting...");
  Serial.println("Current Firmware Version: " + currentFirmwareVersion);

  // ---- WiFiManager ----
  WiFiManager wm;
  wm.setConfigPortalTimeout(180);
  if (!wm.autoConnect("ESP32-Setup", "12345678")) {
    Serial.println("⚠ Failed to connect, restarting...");
    delay(2000);
    ESP.restart();
  }

  Serial.println("WiFi Connected! IP: " + WiFi.localIP().toString());
  delay(1000);

  // ---- MQTT setup ----
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);

  // ---- WDT init ----
  esp_task_wdt_init(WDT_TIMEOUT_SEC, true);
  esp_task_wdt_add(NULL);
  wdtInitialized = true;
  Serial.printf("WDT initialized with %d sec timeout.\n", WDT_TIMEOUT_SEC);

  // ---- أول فحص لتحديث البرنامج ----
  checkForFirmwareUpdate();
}

// ---------------- LOOP ----------------
void loop() {
  if (wdtInitialized)
    esp_task_wdt_reset();

  if (!mqttClient.connected()) {
    if (millis() - lastMQTTConnectAttempt > 5000UL) {
      connectMQTT();
      lastMQTTConnectAttempt = millis();
    }
  } else {
    mqttClient.loop();
  }

  if (millis() - lastUpdateCheck > updateCheckInterval) {
    checkForFirmwareUpdate();
    lastUpdateCheck = millis();
  }

  // قراءة الحساسات ونشر MQTT
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int mq135_raw = analogRead(mq135Pin);
  float mq135_percent = (mq135_raw / 4095.0) * 100.0;

  Serial.println("---- Sensor Data ----");
  if (isnan(temp))
    Serial.println("Temperature: Read Failed");
  else
    Serial.printf("Temperature: %.2f °C\n", temp);

  if (isnan(hum))
    Serial.println("Humidity: Read Failed");
  else
    Serial.printf("Humidity   : %.2f %%\n", hum);

  Serial.printf("MQ135 Raw  : %d\n", mq135_raw);
  Serial.printf("MQ135 Percent: %.2f %%\n", mq135_percent);

  if (mqttClient.connected()) {
    char buf[32];
    String topicTemp = "devices/" + String(deviceUUID) + "/sensors/temperature";
    String topicHum = "devices/" + String(deviceUUID) + "/sensors/humidity";
    String topicGas = "devices/" + String(deviceUUID) + "/sensors/gas";

    if (!isnan(temp)) {
      snprintf(buf, sizeof(buf), "%.2f", temp);
      mqttClient.publish(topicTemp.c_str(), buf);
    }
    if (!isnan(hum)) {
      snprintf(buf, sizeof(buf), "%.2f", hum);
      mqttClient.publish(topicHum.c_str(), buf);
    }
    snprintf(buf, sizeof(buf), "%.2f", mq135_percent);
    mqttClient.publish(topicGas.c_str(), buf);
  }

  if (wdtInitialized)
    esp_task_wdt_reset();
  delay(100);
}

// ---------------- MQTT FUNCTIONS ----------------
void connectMQTT() {
  if (mqttClient.connected())
    return;

  Serial.println("Trying MQTT connection...");
  if (mqttClient.connect(deviceUUID, mqtt_username, mqtt_password)) {
    Serial.println("MQTT Connected!");
    String ledTopic = "devices/" + String(deviceUUID) + "/led";
    mqttClient.subscribe(ledTopic.c_str());
  } else {
    Serial.printf("MQTT failed, state = %d\n", mqttClient.state());
  }
}

void mqttCallback(char *topic, byte *message, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++)
    msg += (char)message[i];

  String ledTopic = "devices/" + String(deviceUUID) + "/led";
  if (String(topic) == ledTopic) {
    if (msg == "on")
      digitalWrite(pinLed1, HIGH);
    if (msg == "off")
      digitalWrite(pinLed1, LOW);
  }

  Serial.printf("MQTT Message arrived [%s]: %s\n", topic, msg.c_str());
}

// ---------------- OTA FUNCTIONS ----------------
void checkForFirmwareUpdate() {
  Serial.println("Checking for firmware update...");

  String latestVersion = fetchLatestVersion();
  if (latestVersion == "") {
    Serial.println("Failed to get latest version.");
    return;
  }

  Serial.println("Latest from GitHub: " + latestVersion);
  Serial.println("Current stored version: " + currentFirmwareVersion);

  if (latestVersion != currentFirmwareVersion) {
    Serial.println("New firmware available → starting OTA...");
    digitalWrite(pinLed2, HIGH);
    downloadAndApplyFirmware(latestVersion);
    digitalWrite(pinLed2, LOW);
  } else {
    Serial.println("Device is up to date.");
  }
}

String fetchLatestVersion() {
  HTTPClient http;
  http.begin(versionUrl);
  int code = http.GET();
  if (code == HTTP_CODE_OK) {
    String v = http.getString();
    v.trim();
    http.end();
    return v;
  } else {
    Serial.printf("Failed to fetch version.txt. HTTP code: %d\n", code);
    http.end();
    return "";
  }
}

void downloadAndApplyFirmware(String latestVersion) {
  HTTPClient http;
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
  http.begin(firmwareUrl);

  int code = http.GET();
  Serial.printf("HTTP GET firmware: %d\n", code);

  if (code == HTTP_CODE_OK) {
    int size = http.getSize();
    Serial.printf("Firmware size: %d bytes\n", size);

    if (size > 0) {
      WiFiClient *stream = http.getStreamPtr();
      if (startOTAUpdate(stream, size, latestVersion)) {
        Serial.println("OTA update successful! Restarting...");
        delay(2000);
        ESP.restart();
      } else
        Serial.println("OTA update failed");
    } else
      Serial.println("Invalid firmware size");

  } else
    Serial.printf("Failed to fetch firmware. HTTP code: %d\n", code);

  http.end();
}

bool startOTAUpdate(WiFiClient *client, int size, String latestVersion) {
  if (!Update.begin(size)) {
    Serial.printf("Update begin failed: %s\n", Update.errorString());
    return false;
  }

  Serial.println("Starting OTA...");
  size_t written = 0;
  uint8_t buf[256];
  unsigned long lastFeed = millis();

  while (written < (size_t)size) {
    if (client->available()) {
      int len = client->read(buf, sizeof(buf));
      if (len > 0) {
        if (Update.write(buf, len) != len) {
          Serial.println("Write mismatch or failed");
          Update.abort();
          return false;
        }
        written += len;
        int progress = (written * 100) / size;
        Serial.printf("OTA Progress: %d%% (%u/%d)\n", progress,
                      (unsigned int)written, size);

        if (wdtInitialized)
          esp_task_wdt_reset();
      }
    } else {
      if (wdtInitialized)
        esp_task_wdt_reset();
      delay(1);
    }

    if (millis() - lastFeed > 1000UL) {
      if (wdtInitialized)
        esp_task_wdt_reset();
      lastFeed = millis();
    }

    yield();
  }

  if (!Update.end()) {
    Serial.printf("Update end failed: %s\n", Update.errorString());
    return false;
  }

  preferences.putString("version", latestVersion);
  currentFirmwareVersion = latestVersion;

  Serial.println("Update completed successfully! New version: " +
                 currentFirmwareVersion);
  return true;
}
