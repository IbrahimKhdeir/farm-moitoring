-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "alert_settings" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "minTemperature" DOUBLE PRECISION,
    "maxTemperature" DOUBLE PRECISION,
    "minHumidity" DOUBLE PRECISION,
    "maxHumidity" DOUBLE PRECISION,
    "minOxygen" DOUBLE PRECISION,
    "maxOxygen" DOUBLE PRECISION,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notificationEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alert_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alert_settings_deviceId_key" ON "alert_settings"("deviceId");

-- AddForeignKey
ALTER TABLE "alert_settings" ADD CONSTRAINT "alert_settings_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
