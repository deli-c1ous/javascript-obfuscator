const types = Babel.packages.types;
const traverse = Babel.packages.traverse.default;
const parse = Babel.packages.parser.parse;
const generate = Babel.packages.generator.default;

function escapeName(str) {
    return [...str].map(char => {
        const code = char.codePointAt(0);
        return "\\u" + code.toString(16).padStart(4, '0').toUpperCase();
    }).join('');
}

function escapeString(str) {
    return [...str].map(char => {
        const code = char.codePointAt(0);
        if (code <= 0xFF) {
            return "\\x" + code.toString(16).padStart(2, '0').toUpperCase();
        } else if (code <= 0xFFFF) {
            return "\\u" + code.toString(16).padStart(4, '0').toUpperCase();
        } else {
            return "\\u{" + code.toString(16).toUpperCase() + "}";
        }
    }).join('');
}
