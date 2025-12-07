const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deviceUuid = 'ESP32_AMER_01';

    console.log(`Checking for device: ${deviceUuid}...`);

    let device = await prisma.device.findUnique({
        where: { deviceUuid },
    });

    if (!device) {
        console.log(`Device not found. Creating ${deviceUuid}...`);
        device = await prisma.device.create({
            data: {
                deviceUuid,
                name: 'Greenhouse ESP32',
            },
        });
        console.log('Device created:', device);
    } else {
        console.log('Device already exists:', device);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
