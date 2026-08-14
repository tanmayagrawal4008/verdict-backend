




const { runCpp } = require("./runner/docker_runner");

async function main() {

    const code = `
#include <iostream>

int main() {

    cout << "Hello";

    return 0;
}
`;

    const result = await runCpp(code);

    console.log(result);
}

main();

