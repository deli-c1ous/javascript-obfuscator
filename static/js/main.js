async function fetchCode(filepath) {
    const response = await fetch(filepath);
    return await response.text();
}

const filepaths = [
    'demo_code.js'
];
const [
    demo_code
] = await Promise.all(filepaths.map(filepath => fetchCode(`static/js/demo_code/${filepath}`)));

export {
    demo_code
};