const amqp = require("amqplib");

async function publish() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "documents";
  await channel.assertExchange(exchange, "topic", { durable: false });

  const queue1 = "document-upload";
  const queue2 = "all-docs";
  const queue3 = "everything";
  await channel.assertQueue(queue1, { durable: false });
  await channel.assertQueue(queue2, { durable: false });

  await channel.bindQueue(queue1, exchange, "document.uploaded");
  await channel.bindQueue(queue2, exchange, "document.*");
  await channel.bindQueue(queue3, exchange, "#");

  const messages = [
    { key: "document.uploaded", msg: "Document uploaded: report.pdf" },
    { key: "document.deleted", msg: "Document deleted: report.pdf" },
    { key: "image.uploaded", msg: "Image uploaded: photo.png" },
  ];

  for (const { key, msg } of messages) {
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(`Published [${key}]: ${msg}`);
  }
}

publish().catch(console.error);
