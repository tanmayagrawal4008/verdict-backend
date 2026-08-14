const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const dockerRunner = require("../docker/docker_runner");

class CppCompiler {

    async compile(sourceCode) {

        const submissionId = crypto.randomUUID();

        const workDir = path.join(
            process.cwd(),
            "src",
            "judge",
            "temp",
            submissionId
        );

        try {

            // Create temporary directory
            await fs.mkdir(workDir, {
                recursive: true
            });

            // Save source code
            const sourcePath = path.join(
                workDir,
                "main.cpp"
            );

            await fs.writeFile(
                sourcePath,
                sourceCode
            );

            // Compile inside Docker
            const result = await dockerRunner.run({

                image: "judge-cpp",

                command: [
                    "g++",
                    "/workspace/main.cpp",
                    "-o",
                    "/workspace/main"
                ],

                workDir,

                timeout: 10000,

                memoryLimit: "512m"
            });

            if (!result.success) {

                return {
                    success: false,
                    verdict: "COMPILATION_ERROR",
                    stderr: result.stderr
                };
            }

            return {
                success: true,
                workDir,
                executable: path.join(
                    workDir,
                    "main"
                )
            };

        } catch (error) {

            return {
                success: false,
                verdict: "COMPILATION_ERROR",
                stderr: error.message
            };
        }
    }
}

module.exports = new CppCompiler();