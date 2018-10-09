"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../token/token");
const lexer_1 = require("./lexer");
test('read chars', () => {
    const input = '=+(){},;';
    const tests = [
        { expectedType: token_1.TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: token_1.TokenEnum.PLUS, expectedLiteral: '+' },
        { expectedType: token_1.TokenEnum.LPAREN, expectedLiteral: '(' },
        { expectedType: token_1.TokenEnum.RPAREN, expectedLiteral: ')' },
        { expectedType: token_1.TokenEnum.LBRACE, expectedLiteral: '{' },
        { expectedType: token_1.TokenEnum.RBRACE, expectedLiteral: '}' },
        { expectedType: token_1.TokenEnum.COMMA, expectedLiteral: ',' },
        { expectedType: token_1.TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: token_1.TokenEnum.EOF, expectedLiteral: '' }
    ];
    const l = new lexer_1.Lexer(input);
    tests.forEach((tt) => {
        const tok = l.nextToken();
        expect(tok.Type).toBe(tt.expectedType);
        expect(tok.Literal).toBe(tt.expectedLiteral);
    });
});
test('next tokens', () => {
    const input = `let five = 5;`;
    // let ten = 10;
    // let add = fn(x, y) {
    //     x + y;
    // };
    // let result = add(five, ten);`;
    const tests = [
        { expectedType: token_1.TokenEnum.LET, expectedLiteral: 'let' },
        { expectedType: token_1.TokenEnum.IDENT, expectedLiteral: 'five' },
        { expectedType: token_1.TokenEnum.ASSIGN, expectedLiteral: '=' },
        { expectedType: token_1.TokenEnum.INT, expectedLiteral: '5' },
        { expectedType: token_1.TokenEnum.SEMICOLON, expectedLiteral: ';' },
        // { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'ten' },
        // { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        // { expectedType: TokenEnum.INT, expectedLiteral: '10' },
        // { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        // { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'add' },
        // { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        // { expectedType: TokenEnum.FUNCTION, expectedLiteral: 'fn' },
        // { expectedType: TokenEnum.LPAREN, expectedLiteral: '(' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'x' },
        // { expectedType: TokenEnum.COMMA, expectedLiteral: ',' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'y' },
        // { expectedType: TokenEnum.RPAREN, expectedLiteral: ')' },
        // { expectedType: TokenEnum.LBRACE, expectedLiteral: '{' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'x' },
        // { expectedType: TokenEnum.PLUS, expectedLiteral: '+' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'y' },
        // { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        // { expectedType: TokenEnum.RBRACE, expectedLiteral: '}' },
        // { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        // { expectedType: TokenEnum.LET, expectedLiteral: 'let' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'result' },
        // { expectedType: TokenEnum.ASSIGN, expectedLiteral: '=' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'add' },
        // { expectedType: TokenEnum.LPAREN, expectedLiteral: '(' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'five' },
        // { expectedType: TokenEnum.COMMA, expectedLiteral: ',' },
        // { expectedType: TokenEnum.IDENT, expectedLiteral: 'ten' },
        // { expectedType: TokenEnum.RPAREN, expectedLiteral: ')' },
        // { expectedType: TokenEnum.SEMICOLON, expectedLiteral: ';' },
        { expectedType: token_1.TokenEnum.EOF, expectedLiteral: '' },
    ];
    const l = new lexer_1.Lexer(input);
    tests.forEach((tt) => {
        const tok = l.nextToken();
        expect(tok.Type).toBe(tt.expectedType);
        expect(tok.Literal).toBe(tt.expectedLiteral);
    });
});
//# sourceMappingURL=lexer.test.js.map