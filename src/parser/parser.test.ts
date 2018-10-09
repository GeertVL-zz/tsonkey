import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Statement, LetStatement } from "../ast/ast";

test('let statements', () => {
    const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
    `;

    const l = new Lexer(input);
    const p = new Parser(l);

    const program = p.parseProgram();
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

function testLetStatement(s: Statement, name: string): void {
    expect(s.tokenLiteral()).toBe('let');
    expect(s).toBeInstanceOf(LetStatement);
    const letStat: LetStatement = s as LetStatement;
    expect(letStat.name.value).toBe(name);
    expect(letStat.name.tokenLiteral()).toBe(name);
}