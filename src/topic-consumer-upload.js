const amqp = require("amqplib");

async function consume() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "documents";
  const queue = "everything";
  await channel.assertExchange(exchange, "topic", { durable: false });

  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, "document.uploaded");

  console.log(
    `Waiting for messages on [${queue}] bound to [document.uploaded]... `,
  );

  channel.consume(queue, (msg) => {
    if (msg) {
      console.log(
        `[${queue}] Received [${msg.fields.routingKey}]: ${msg.content.toString()}`,
      );
      channel.ack(msg);
    }
  });
}

consume().catch(console.error);
