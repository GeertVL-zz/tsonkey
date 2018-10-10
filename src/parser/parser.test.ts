import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Statement, LetStatement, ReturnStatement, ExpressionStatement, Identifier, IntegerLiteral, Expression, PrefixExpression, InfixExpression } from "../ast/ast";

test('let statements', () => {
    const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `;

    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
    checkParserErrors(p);
    expect(program).toBeDefined();
    expect(program.statements.length).toBe(3);

    const tests = [
        { expectedIdentifier: 'x' },
        { expectedIdentifier: 'y' },
        { expectedIdentifier: 'foobar' },
    ]

    tests.forEach((tt, idx) => {
        const stmt = program.statements[idx];
        testLetStatement(stmt, tt.expectedIdentifier);
    });
});

test('return statements', () => {
    const input = `
    return 5;
    return 10;
    return 993322;
    `;

    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();
    checkParserErrors(p);

    expect(program.statements.length).toBe(3);
    program.statements.forEach((stmt) => {
        expect(stmt).toBeInstanceOf(ReturnStatement);
        const returnStmt: ReturnStatement = stmt as ReturnStatement;
        expect(returnStmt.tokenLiteral()).toBe('return');
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
        { input: '!5;', operator: '!', integerValue: 5 },
        { input: '-15;', operator: '-', integerValue: 15 }
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
        testIntegerLiteral(exp.right, tt.integerValue);
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
        { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 }
    ];

    infixTests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.statements.length).toBe(1);
        expect(program.statements[0]).toBeInstanceOf(ExpressionStatement);
        const stmt = <ExpressionStatement>program.statements[0];
        expect(stmt.expression).toBeInstanceOf(InfixExpression);
        const exp = <InfixExpression>stmt.expression;
        testIntegerLiteral(exp.left, tt.leftValue);
        expect(exp.operator).toBe(tt.operator);
        testIntegerLiteral(exp.right, tt.rightValue);
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
        { input: '3 + 4 * 5 == 3 * 1 + 4 * 5', expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' }
    ];

    tests.forEach((tt) => {
        const l = new Lexer(tt.input);
        const p = new Parser(l);
        const program = p.parseProgram();
        checkParserErrors(p);

        expect(program.string()).toBe(tt.expected);
    });
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