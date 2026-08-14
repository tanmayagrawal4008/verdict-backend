const { spawn } = require("child_process");

class DockerRunner {

    async run({
        image,
        command,
        workDir,
        timeout = 2000,
        memoryLimit = "256m",
        networkDisabled = true,
        input = ""
    }) {

        const dockerArgs = [
            "run",
            "--rm",
            "-i",
            "--memory",
            memoryLimit,

            "--cpus",
            "1",

            ...(networkDisabled
                ? ["--network", "none"]
                : []),

            "-v",
            `${workDir}:/workspace`,

            image,

            ...command
        ];

        return new Promise((resolve) => {

            const process = spawn(
                "docker",
                dockerArgs
            );

            let stdout = "";
            let stderr = "";
            let finished = false;

            const timer = setTimeout(() => {

                if (finished) return;

                finished = true;

                process.kill("SIGTERM");

                resolve({
                    success: false,
                    status: "TIME_LIMIT_EXCEEDED",
                    stdout,
                    stderr
                });

            }, timeout);


            process.stdout.on("data", (data) => {

                stdout += data.toString();

            });


            process.stderr.on("data", (data) => {

                stderr += data.toString();

            });


            // Send input to Docker container

            process.stdin.write(input);
            process.stdin.end();


            process.on("close", (code) => {

                if (finished) return;

                finished = true;

                clearTimeout(timer);

                if (code === 0) {

                    resolve({
                        success: true,
                        stdout,
                        stderr
                    });

                } else {

                    resolve({
                        success: false,
                        status: "RUNTIME_ERROR",
                        stdout,
                        stderr
                    });

                }

            });


            process.on("error", (error) => {

                if (finished) return;

                finished = true;

                clearTimeout(timer);

                resolve({
                    success: false,
                    status: "RUNTIME_ERROR",
                    stdout,
                    stderr: error.message
                });

            });

        });
    }
}

module.exports = new DockerRunner();