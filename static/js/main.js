async function fetchCode(filepath) {
    const response = await fetch(filepath);
    return await response.text();
}

const filepaths = [
    'static_obfuscate.js',
    'string2varAdd1.js'
];
const [
    static_obfuscate_demo_code,
    string2varAdd1_demo_code
] = await Promise.all(filepaths.map(filepath => fetchCode(`static/js/demo_code/${filepath}`)));

export {
    static_obfuscate_demo_code,
    string2varAdd1_demo_code
};