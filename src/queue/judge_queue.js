const {Queue}  = require('bullmq');
const redisConnection  = require('./redis_connection');

const judgeQueue = new Queue( "judge_queue", {
    connection : redisConnection,
    defaultJobOptions : {
        attempts : 3,
        backoff: {
            type: "exponential",
            delay: 2000
        },

        removeOnComplete: 100,
        removeOnFail: 100
    }
})


module.exports = judgeQueue;


