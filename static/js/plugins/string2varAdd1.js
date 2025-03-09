function string2varAdd1(ast) {
    let string = '';
    const visitor = {
        'StringLiteral|TemplateElement'(path) {
            const str = path.isStringLiteral() ? path.node.value : path.node.value.cooked;
            string += str;
        },
    };
    traverse(ast, visitor);

    const chars = [...new Set(string), ''];
    const shuffledChars = _.shuffle(chars);
    let varCount = 0;
    const assignment_exprs = shuffledChars.map(char => types.assignmentExpression('=', types.identifier(`v${varCount++}`), types.stringLiteral(char)));
    const expr_stmt = types.expressionStatement(types.sequenceExpression(assignment_exprs));
    const char2name = new Map(shuffledChars.map((char, index) => [char, assignment_exprs[index].left.name]));

    const visitor2 = {
        StringLiteral(path) {
            const { value } = path.node;
            const name = char2name.get(value.length === 0 ? '' : value[0]);
            let expr;
            if (value.length > 1) {
                expr = types.binaryExpression('+', types.identifier(name), types.stringLiteral(value.slice(1)));
            } else {
                expr = types.identifier(name);
            }
            path.replaceInline(expr);
        },
        TemplateLiteral(path) {
            const { quasis, expressions } = path.node;
            const new_expressions = [];
            for (const quasi of quasis) {
                const { cooked } = quasi.value;
                if (cooked.length > 0) {
                    new_expressions.push(...[...cooked].map(char => types.identifier(char2name.get(char))));
                }
                if (expressions.length > 0) {
                    new_expressions.push(expressions.shift());
                }
            }
            if (new_expressions.length === 0) {
                new_expressions.push(types.identifier(char2name.get('')));
            }
            const new_quasis = new Array(new_expressions.length).fill(types.templateElement({
                raw: '',
                cooked: ''
            }, false));
            new_quasis.push(types.templateElement({
                raw: '',
                cooked: '',
            }, true));
            path.node.expressions = new_expressions;
            path.node.quasis = new_quasis;
        }
    };
    traverse(ast, visitor2);

    ast.program.body.unshift(expr_stmt);
}