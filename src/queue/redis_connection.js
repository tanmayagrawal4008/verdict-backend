const IORedis = require("ioredis");

const redisConnection = new IORedis(
    process.env.REDIS_URL,
  {
    tls: {},
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

redisConnection.on("connect", () => {
  console.log("Redis connected");
});

redisConnection.on("error", (error) => {
  console.error("Redis connection error:", error.message || error);
});






module.exports = redisConnection;

