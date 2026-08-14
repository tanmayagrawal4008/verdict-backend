const { runCpp } = require("./runner/docker_runner");

async function main() {

    const code = `
#include <iostream>

int main() {
    std::cout << "Hello Judge";
    return 0;
}
`;

    const result = await runCpp(code);

    console.log(result);
}

main();