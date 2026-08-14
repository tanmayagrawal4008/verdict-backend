const dockerRunner = require("../docker/docker_runner");

class CppExecutor {

    async execute({
        workDir,
        input,
        timeLimit,
        memoryLimit
    }) {

        const result = await dockerRunner.run({

            image: "judge-cpp",

            command: [
                "/workspace/main"
            ],

            workDir,

            timeout: timeLimit,

            memoryLimit, 
            input
        });

        if (!result.success) {

            if (
                result.status ===
                "TIME_LIMIT_EXCEEDED"
            ) {
                return {
                    verdict: "TIME_LIMIT_EXCEEDED",
                    stdout: result.stdout,
                    stderr: result.stderr
                };
            }

            return {
                verdict: "RUNTIME_ERROR",
                stdout: result.stdout,
                stderr: result.stderr
            };
        }

        return {
            verdict: "EXECUTION_SUCCESS",
            stdout: result.stdout,
            stderr: result.stderr
        };
    }
}

module.exports = new CppExecutor();