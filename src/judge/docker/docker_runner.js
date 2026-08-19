const { spawn } = require("child_process");

class DockerRunner {

    async run({
        image,
        command,
        workDir,
        timeout = 2000,
        memoryLimit = "256m",
        networkDisabled = true,
        input = "",
        readOnlyWorkspace = false,
        readOnlyRoot = false,
        runAsNonRoot = false
    }) {

        const dockerArgs = [
            "run",
            "--rm",
            "-i",
            "--memory",
            memoryLimit,

            "--cpus",
            "1",

            "--pids-limit",
            "64",

            "--cap-drop",
            "ALL",

            "--security-opt",
            "no-new-privileges",

            ...(readOnlyRoot
                ? ["--read-only", "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=16m"]
                : []),

            ...(runAsNonRoot
                ? ["--user", "65534:65534"]
                : []),

            ...(networkDisabled
                ? ["--network", "none"]
                : []),

            "-v",
            `${workDir}:/workspace${readOnlyWorkspace ? ":ro" : ""}`,

            image,

            ...command
        ];

        return new Promise((resolve) => {

            const child = spawn(
                "docker",
                dockerArgs
            );

            let stdout = "";
            let stderr = "";
            let finished = false;

            const finish = (result) => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                resolve(result);
            };

            const timer = setTimeout(() => {

                if (finished) return;

                child.kill("SIGTERM");
                setTimeout(() => child.kill("SIGKILL"), 1000).unref();

                finish({
                    success: false,
                    status: "TIME_LIMIT_EXCEEDED",
                    stdout,
                    stderr
                });

            }, timeout);


            child.stdout.on("data", (data) => {

                stdout += data.toString();

            });


            child.stderr.on("data", (data) => {

                stderr += data.toString();

            });


            // Send input to Docker container

            child.stdin.on("error", () => {});
            child.stdin.end(String(input ?? ""));


            child.on("close", (code) => {

                if (finished) return;

                if (code === 0) {

                    finish({
                        success: true,
                        stdout,
                        stderr
                    });

                } else {

                    finish({
                        success: false,
                        status: "RUNTIME_ERROR",
                        stdout,
                        stderr
                    });

                }

            });


            child.on("error", (error) => {

                if (finished) return;

                finish({
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
