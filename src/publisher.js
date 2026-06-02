const amqp = require("amqplib");

async function publish() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "test-queue";
  await channel.assertQueue(queue, { durable: false });

  for (let i = 1; i <= 10; i++) {
    const msg = `Message ${i} - ${new Date().toISOString()}`;
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`Sent: ${msg}`);
  }

  await channel.close();
  await connection.close();
}

publish().catch(console.error);
