const {Worker } = require('bullmq');
const redisConnection = require('./redis_connection');
const judgeService = require('../judge/judge_service');

const judgeWorker = new Worker(
    "judge_queue",
    async (job)=>{
         console.log(
            `Judging submission: ${job.id}`
        );


         const {
            submissionId,
            sourceCode,
            language,
            testCases,
            timeLimit,
            memoryLimit
        } = job.data;

        const result =
            await judgeService.judgeSubmission({

                submissionId,

                sourceCode,

                language,

                testCases,

                timeLimit,

                memoryLimit
            });


        console.log(
            `Submission ${submissionId} verdict: ${result.verdict}`
        );


        return result;

    },


     {
        connection: redisConnection,

        concurrency: 2
    }
)



judgeWorker.on("completed", (job) => {

    console.log(
        `Job ${job.id} completed`
    );

});


judgeWorker.on("failed", (job, error) => {

    console.error(
        `Job ${job?.id} failed:`,
        error
    );

});



console.log("Judge worker started");


module.exports = judgeWorker;
    