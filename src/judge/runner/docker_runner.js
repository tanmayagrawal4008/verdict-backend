const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

async function runCpp(sourceCode, input = "") {

    const id = crypto.randomUUID();

    const workDir = path.join(
        os.tmpdir(),
        `judge-${id}`
    );

    try {

        // Create temporary directory
        await fs.mkdir(workDir, { recursive: true });

        // Write source code
        await fs.writeFile(
            path.join(workDir, "main.cpp"),
            sourceCode
        );


        // =========================
        // STEP 1: COMPILE
        // =========================

        try {

            await execFileAsync(
                "docker",
                [
                    "run",
                    "--rm",

                    "-v",
                    `${workDir}:/app`,

                    "judge-cpp",

                    "g++",
                    "/app/main.cpp",
                    "-o",
                    "/app/main"
                ]
            );

        } catch (error) {

            return {
                status: "COMPILATION_ERROR",
                stdout: error.stdout || "",
                stderr: error.stderr || error.message
            };
        }


        // =========================
        // STEP 2: EXECUTE
        // =========================

        try {

            const { stdout, stderr } =
                await execFileAsync(
                    "docker",
                    [
                        "run",
                        "--rm",

                        "-v",
                        `${workDir}:/app`,

                        "judge-cpp",

                        "/app/main"
                    ],
                    {
                        input
                    }
                );

            return {
                status: "SUCCESS",
                stdout,
                stderr
            };

        } catch (error) {

            return {
                status: "RUNTIME_ERROR",
                stdout: error.stdout || "",
                stderr: error.stderr || error.message
            };
        }

    } finally {

        await fs.rm(workDir, {
            recursive: true,
            force: true
        });
    }
}

module.exports = {
    runCpp
};