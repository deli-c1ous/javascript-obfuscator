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
    const prefix_name = '𝗏';
    const assignment_exprs = shuffledChars.map(char => types.assignmentExpression('=', types.identifier(`${prefix_name}${varCount++}`), types.stringLiteral(char)));
    const expr_stmt = types.expressionStatement(types.sequenceExpression(assignment_exprs));
    const char2name = new Map(shuffledChars.map((char, index) => [char, `${prefix_name}${index}`]));

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

function string2varAdd2(ast) {
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
    const elements = shuffledChars.map(char => types.stringLiteral(char));
    const arr_name = '𝚊';
    const assignment_expr = types.assignmentExpression('=', types.identifier(arr_name), types.arrayExpression(elements));
    const expr_stmt = types.expressionStatement(assignment_expr);
    const char2index = new Map(shuffledChars.map((char, index) => [char, index]));

    const visitor2 = {
        StringLiteral(path) {
            const { value } = path.node;
            const index = char2index.get(value.length === 0 ? '' : value[0]);
            let expr;
            if (value.length > 1) {
                expr = types.binaryExpression('+', types.memberExpression(types.identifier(arr_name), types.numericLiteral(index), true), types.stringLiteral(value.slice(1)));
            } else {
                expr = types.memberExpression(types.identifier(arr_name), types.numericLiteral(index), true);
            }
            path.replaceInline(expr);
        },
        TemplateLiteral(path) {
            const { quasis, expressions } = path.node;
            const new_expressions = [];
            for (const quasi of quasis) {
                const { cooked } = quasi.value;
                if (cooked.length > 0) {
                    new_expressions.push(...[...cooked].map(char => types.memberExpression(types.identifier(arr_name), types.numericLiteral(char2index.get(char)), true)));
                }
                if (expressions.length > 0) {
                    new_expressions.push(expressions.shift());
                }
            }
            if (new_expressions.length === 0) {
                new_expressions.push(types.memberExpression(types.identifier(arr_name), types.numericLiteral(char2index.get('')), true));
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