const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "test-queue";
  await channel.assertQueue(queue, { durable: false });

  console.log("Waiting for messages....");

  channel.consume(queue, (msg) => {
    if (msg) {
      console.log(`Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

consume().catch(console.error);
