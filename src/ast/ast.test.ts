import { Program, LetStatement, Identifier } from "./ast";
import { TokenEnum } from "../token/token";

test('string', () => {
    const program = new Program();
    program.statements = [];
    const letStmt = new LetStatement();
    letStmt.token = { Type: TokenEnum.LET, Literal: 'let' };
    letStmt.name = new Identifier({ Type: TokenEnum.IDENT, Literal: 'myVar' },
        'myVar');
    letStmt.value = new Identifier({ Type: TokenEnum.IDENT, Literal: 'anotherVar' },
        'anotherVar');
    program.statements.push(letStmt);

    expect(program.string()).toBe('let myVar = anotherVar;');
});

