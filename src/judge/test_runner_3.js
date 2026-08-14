




const { runCpp } = require("./runner/docker_runner");

async function main() {

    const code = `
#include <iostream>

int main() {

    int x = 10;
    int y = 0;

    std::cout << x / y;

    return 0;
}
`;

    const result = await runCpp(code);

    console.log(result);
}

main();

