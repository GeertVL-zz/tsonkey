import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Statement, LetStatement, ReturnStatement, ExpressionStatement, Identifier, IntegerLiteral, Expression, PrefixExpression, InfixExpression, Bool, IfExpression, FunctionLiteral } from "../ast/ast";

test('let statements', () => {
    const tests = [
        { input: 'let x = 5;', expectedIdentifier: 'x', expectedValue: 5 },
        { input: 'let y = true;', expectedIdentifier: 'y', expectedValue: true },
        { input: 'let foobar = y;', expectedIdentifier: 'foobar', expectedValue: 'y' }
    ];

    tests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        testLetStatement(program.statements[0], tt.expectedIdentifier);
        const val = (<LetStatement>program.statements[0]).value;
        testLiteralExpression(val, tt.expectedValue);
    });
});

test('return statements', () => {
    const tests = [
        { input: 'return 5;', expectedValue: 5 },
        { input: 'return 10;', expectedValue: 10 },
        { input: 'return 993322;', expectedValue: 993322 }
    ];
        
    tests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);

        expect(program.statements[0]).toBeInstanceOf(ReturnStatement);
        const returnStmt = <ReturnStatement>program.statements[0];
        expect(returnStmt.tokenLiteral()).toBe('return');
        testLiteralExpression(returnStmt.returnValue, tt.expectedValue);
    });
});

test('identifier expression', () => {
    const input = 'foobar;';

    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(1);
    expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
    let stmt = <ExpressionStatement>program.statements[0];
    expect(stmt.expression).toBeInstanceOf(Identifier);
    let ident = <Identifier>stmt.expression;
    expect(ident.value).toBe('foobar');
    expect(ident.tokenLiteral()).toBe('foobar');
});

test('integer literal expressions', () => {
    const input = '5;';

    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(1);
    expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
    const stmt = <ExpressionStatement>program.statements[0];
    expect(stmt.expression).toBeInstanceOf(IntegerLiteral);
    const literal = <IntegerLiteral>stmt.expression;
    expect(literal.value).toBe(5);
    expect(literal.tokenLiteral()).toBe('5');
});

test('parsing prefix expressions', () => {
    const prefixTests = [
        { input: '!5;', operator: '!', value: 5 },
        { input: '-15;', operator: '-', value: 15 },
        { input: '!true;', operator: '!', value: true },
        { input: '!false;', operator: '!', value: false }
    ];

    prefixTests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
        const stmt = <ExpressionStatement>program.statements[0];
        expect(stmt.expression).toBeInstanceOf(PrefixExpression);
        const exp = <PrefixExpression>stmt.expression;
        expect(exp.operator).toBe(tt.operator);
        testLiteralExpression(exp.right, tt.value);
    });
});

test('parsing infix expressions', () => {
    const infixTests = [
        { input: '5 + 5;', leftValue: 5, operator: '+', rightValue: 5 },
        { input: '5 - 5;', leftValue: 5, operator: '-', rightValue: 5 },
        { input: '5 * 5;', leftValue: 5, operator: '*', rightValue: 5 },
        { input: '5 / 5;', leftValue: 5, operator: '/', rightValue: 5 },
        { input: '5 > 5;', leftValue: 5, operator: '>', rightValue: 5 },
        { input: '5 == 5;', leftValue: 5, operator: '==', rightValue: 5 },
        { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 },
        { input: 'true == true', leftValue: true, operator: '==', rightValue: true },
        { input: 'true != false', leftValue: true, operator: '!=', rightValue: false },
        { input: 'false == false', leftValue: false, operator: '==', rightValue: false }
    ];

    infixTests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
        const stmt = <ExpressionStatement>program.statements[0];
        testInfixExpression(stmt.expression, tt.leftValue, 
            tt.operator, tt.rightValue);
    });
});

test('operator precedence parsing', () => {
    const tests = [
        { input: '-a * b', expected: '((-a) * b)' },
        { input: '!-a', expected: '(!(-a))' },
        { input: 'a + b + c', expected: '((a + b) + c)' },
        { input: 'a + b - c', expected: '((a + b) - c)' },
        { input: 'a * b * c', expected: '((a * b) * c)' },
        { input: 'a * b / c', expected: '((a * b) / c)' },
        { input: 'a + b / c', expected: '(a + (b / c))' },
        { input: 'a + b * c + d / e - f', expected: '(((a + (b * c)) + (d / e)) - f)' },
        { input: '3 + 4; -5 * 5', expected: '(3 + 4)((-5) * 5)' },
        { input: '5 > 4 == 3 < 4', expected: '((5 > 4) == (3 < 4))' },
        { input: '5 < 4 != 3 > 4', expected: '((5 < 4) != (3 > 4))' },
        { input: '3 + 4 * 5 == 3 * 1 + 4 * 5', expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' },
        { input: 'true', expected: 'true' },
        { input: 'false', expected: 'false' },
        { input: '3 > 5 == false', expected: '((3 > 5) == false)' },
        { input: '3 < 5 == true', expected: '((3 < 5) == true)' },
        { input: '1 + (2 + 3) + 4', expected: '((1 + (2 + 3)) + 4)' },
        { input: '(5 + 5) * 2', expected: '((5 + 5) * 2)' },
        { input: '2 / (5 + 5)', expected: '(2 / (5 + 5))' },
        { input: '-(5 + 5)', expected: '(-(5 + 5))' },
        { input: '!(true == true)', expected: '(!(true == true))' }
    ];

    tests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.string()).toBe(tt.expected);
    });
});

test('if expression', () => {
    const input = 'if (x < y) { x }';

    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(1);
    expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
    const stmt = <ExpressionStatement>program.statements[0];
    expect(stmt.expression).toBeInstanceOf(IfExpression);
    const exp = <IfExpression>stmt.expression;
    testInfixExpression(exp.condition, 'x', '<', 'y');
    expect(exp.consequence.statements.length).toBe(1);
    expect(exp.consequence.statements[0]).toBeInstanceOf(ExpressionStatement);
    const consequence = <ExpressionStatement>exp.consequence.statements[0];
    testIdentifier(consequence.expression, 'x');
    expect(exp.alternative).toBeNull();
});

test('function literal parsing', () => {
    const input = 'fn(x, y) { x + y; }';

    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(1);
    expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
    const stmt = <ExpressionStatement>program.statements[0];
    expect(stmt.expression).toBeInstanceOf(FunctionLiteral);
    const funct = <FunctionLiteral>stmt.expression;
    expect(funct.parameters.length).toBe(2);
    testLiteralExpression(funct.parameters[0], 'x');
    testLiteralExpression(funct.parameters[1], 'y');
    expect(funct.body.statements.length).toBe(1);
    expect(funct.body.statements[0]).toBeInstanceOf(ExpressionStatement);
    const bodyStmt = <ExpressionStatement>funct.body.statements[0];
    testInfixExpression(bodyStmt.expression, 'x', '+', 'y');
});

test('function parameter parsing', () => {
    const tests = [
        { input: 'fn() {};', expectedParams: [] },
        { input: 'fn(x) {};', expectedParams: ['x'] },
        { input: 'fn(x, y , z) {};', expectedParams: ['x', 'y', 'z'] }
    ];

    tests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
        const stmt = <ExpressionStatement>program.statements[0];
        const funct = <FunctionLiteral>stmt.expression;

        expect(funct.parameters.length).toBe(tt.expectedParams.length);

        tt.expectedParams.forEach((ident, idx) => {
            testLiteralExpression(funct.parameters[idx], ident);
        });
    })
});


// helpers

function testLetStatement(s: Statement, name: string): void {
    expect(s.tokenLiteral()).toBe('let');
    expect(s).toBeInstanceOf(LetStatement);
    const letStat: LetStatement = s as LetStatement;
    expect(letStat.name.value).toBe(name);
    expect(letStat.name.tokenLiteral()).toBe(name);
}

function testIntegerLiteral(il: Expression, value: number): void {
    expect(il).toBeInstanceOf(IntegerLiteral);
    const integ = <IntegerLiteral>il;
    expect(integ.value).toBe(value);
    expect(integ.tokenLiteral()).toBe(String(value));
}

function testIdentifier(exp: Expression, value: string): void {
    expect(exp).toBeInstanceOf(Identifier);
    const ident = <Identifier>exp;
    expect(ident.value).toBe(value);
    expect(ident.tokenLiteral()).toBe(value);
}

function testBooleanLiteral(exp: Expression, value: boolean): void {
    expect(exp).toBeInstanceOf(Bool);
    const bo = <Bool>exp;
    expect(bo.value).toBe(value);
    expect(bo.tokenLiteral()).toBe(`${value}`);
}

function testLiteralExpression(exp: Expression, expected: any): void {
    switch (typeof expected) {
        case 'number':
            testIntegerLiteral(exp, <number>expected);
            break;
        case 'string':
            testIdentifier(exp, expected);    
            break;
        case 'boolean':
            testBooleanLiteral(exp, <boolean>expected);   
            break; 
        default:
            throw new Error(`type of exp not handled. got=${exp}`);
    }
}

function testInfixExpression(exp: Expression, left: any, operator: string, right: any) {
    expect(exp).toBeInstanceOf(InfixExpression);
    const opExp = <InfixExpression>exp;
    testLiteralExpression(opExp.left, left);
    expect(opExp.operator).toBe(operator);
    testLiteralExpression(opExp.right, right);
}

function checkParserErrors(p: Parser) {
    const errors = p.errors;
    if (errors.length == 0) {
        return;
    }

    errors.forEach((err) => {
        console.log(err);
    });

    throw new Error('testing parser error');
}