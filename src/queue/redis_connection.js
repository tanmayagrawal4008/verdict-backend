const IORedis = require('ioredis');

const redisConnection = new IORedis({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    maxRetriesPerRequest : null
})


redisConnection.on("connect ", ()=>{
    console.log("redis connected");
})

redisConnection.on("error", (error)=>{
    console.log("Redis error :", error);

})


module.exports = redisConnection;
