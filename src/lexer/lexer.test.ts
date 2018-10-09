import { TokenEnum, Token } from "../token/token";
import { Lexer } from "./lexer";

test('next token', () => {
    const input = '=+(){},;';

    const tests = [
        { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenEnum.PLUS, expectedLiteral: '+' },
        { expectedType: TokenEnum.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenEnum.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenEnum.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenEnum.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenEnum.COMMA, expectedLiteral: ',' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.EOF, expectedLiteral: '' }
    ];

    const l = new Lexer(input);
    tests.forEach((tt) => {
        const tok: Token = l.nextToken();
        expect(tok.Type).toBe(tt.expectedType);
        expect(tok.Literal).toBe(tt.expectedLiteral);
    });
});