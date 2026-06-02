const amqp = require("amqplib");

let channel; 
async function connectRabbitMQ() {
    const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
    channel = await connection.createChannel();
    await channel.assertExchange("dms.events", "topic", { durable: true });
}

async function publishEvent(routingKey, message) {
    if (!channel) await connectRabbitMQ();
    channel.publish(
        "dms.events",
        routingKey,
        Buffer.from(JSON.stringify(message),
            { persistent: true}
        )
    );
    console.log(`Published: ${routingKey}`);
}

module.exports = { publishEvent, connectRabbitMQ };
