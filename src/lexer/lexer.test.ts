import { TokenEnum, Token } from "../token/token";
import { Lexer } from "./lexer";

test('read chars', () => {
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

test('next tokens', () => {
    const input = `let five = 5;
    let ten = 10;
    
    let add = fn(x, y) {
        x + y;
    };
    
    let result = add(five, ten);`;

    const tests = [
        { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenEnum.INT, expectedLiteral: '5' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenEnum.INT, expectedLiteral: '10' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenEnum.FUNCTION, expectedLiteral: 'fn' },
        { expectedType: TokenEnum.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenEnum.COMMA, expectedLiteral: ',' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenEnum.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenEnum.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenEnum.PLUS, expectedLiteral: '+' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'result' },
        { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenEnum.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenEnum.COMMA, expectedLiteral: ',' },
        { expectedType: TokenEnum.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenEnum.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenEnum.EOF, expectedLiteral: '' },
    ];

    const l = new Lexer(input);
    tests.forEach((tt) => {
        const tok: Token = l.nextToken();
        expect(tok.Type).toBe(tt.expectedType);
        console.log(`expected: ${tok.Literal} and got ${tt.expectedLiteral}`);
        expect(tok.Literal).toBe(tt.expectedLiteral);
    });
});