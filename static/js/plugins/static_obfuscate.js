const types = Babel.packages.types;
const traverse = Babel.packages.traverse.default;
const parse = Babel.packages.parser.parse;
const generate = Babel.packages.generator.default;
const { CartesianProduct } = Combinatorics;

function staticObfuscate(ast, { escape_identifier = false, rename_variable = false } = {}) {
    function escapeString() {
        function escape(str) {
            return [...str].map(char => {
                const code = char.codePointAt(0);
                if (code <= 255) {
                    return "\\x" + code.toString(16).padStart(2, '0').toUpperCase();
                } else {
                    return "\\u{" + code.toString(16).toUpperCase() + "}";
                }
            }).join('');
        }

        const visitor = {
            StringLiteral(path) {
                const { value } = path.node;
                if (!path.node.extra) {
                    path.node.extra = {
                        rawValue: value,
                    };
                }
                path.node.extra.raw = `'${escape(value)}'`;
            },
            TemplateElement(path) {
                const { cooked } = path.node.value;
                path.node.value.raw = escape(cooked);
            }
        };
        traverse(ast, visitor);
    }

    function escapeIdentifier() {
        function escape(str) {
            return [...str].map(char => {
                const code = char.codePointAt(0);
                return "\\u{" + code.toString(16).toUpperCase() + "}";
            }).join('');
        }

        const visitor = {
            Identifier(path) {
                const { name } = path.node;
                path.node.name = escape(name);
            }
        };
        traverse(ast, visitor);
    }

    function renameVariable() {
        function getObfuscatedNames() {
            const arrs = [
                ['d', 'D'],
                ['e', 'E', '3'],
                ['l', 'L', '1'],
                ['i', 'I', '1'],
                ['c', 'C'],
                ['1', 'i', 'I'],
                ['o', 'O', '0'],
                ['u', 'U'],
                ['s', 'S', '5'],
            ];
            return [...CartesianProduct.from(arrs)].map(arr => arr.join(''));
        }

        const obfuscated_names = getObfuscatedNames();
        let name_count = 0;

        const rename_visitor = {
            Scope(path) {
                path.scope.crawl();
                for (const binding of Object.values(path.scope.bindings)) {
                    const name = binding.identifier.name;
                    if (name_count < obfuscated_names.length) {
                        path.scope.rename(name, obfuscated_names[name_count++]);
                    }
                }
            }
        };
        traverse(ast, rename_visitor);
    }

    function escapeNumber() {
        const visitor = {
            NumericLiteral(path) {
                const { value } = path.node;
                path.node.extra = {
                    rawValue: value,
                };
                path.node.extra.raw = `0O${value.toString(8)}`;
            }
        };
        traverse(ast, visitor);
    }

    const visitor = {
        // 点属性转方括号属性
        MemberExpression(path) {
            if (!path.node.computed) {
                path.node.computed = true;
                path.node.property = types.stringLiteral(path.node.property.name);
            }
        },
        // 块语句包装
        IfStatement(path) {
            const { consequent, alternate } = path.node;
            if (!types.isBlockStatement(consequent)) {
                path.node.consequent = types.blockStatement([consequent]);
            }
            if (alternate && !types.isBlockStatement(alternate)) {
                path.node.alternate = types.blockStatement([alternate]);
            }
        },
    };
    traverse(ast, visitor);

    escapeNumber();
    escapeString();

    if (rename_variable) {
        renameVariable();
    }
    if (escape_identifier) {
        escapeIdentifier();
    }
}