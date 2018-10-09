"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../token/token");
class Lexer {
    constructor(input) {
        this.readPosition = 0;
        this.input = input;
        this.readChar();
    }
    readChar() {
        if (this.readPosition >= this.input.length) {
            this.ch = '\0';
        }
        else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    }
    nextToken() {
        let tok = {};
        this.skipWhitespace();
        switch (this.ch) {
            case '=':
                tok = { Type: token_1.TokenEnum.ASSIGN, Literal: this.ch };
                break;
            case ';':
                tok = { Type: token_1.TokenEnum.SEMICOLON, Literal: this.ch };
                break;
            case '(':
                tok = { Type: token_1.TokenEnum.LPAREN, Literal: this.ch };
                break;
            case ')':
                tok = { Type: token_1.TokenEnum.RPAREN, Literal: this.ch };
                break;
            case ',':
                tok = { Type: token_1.TokenEnum.COMMA, Literal: this.ch };
                break;
            case '+':
                tok = { Type: token_1.TokenEnum.PLUS, Literal: this.ch };
                break;
            case '{':
                tok = { Type: token_1.TokenEnum.LBRACE, Literal: this.ch };
                break;
            case '}':
                tok = { Type: token_1.TokenEnum.RBRACE, Literal: this.ch };
                break;
            case '\0':
                tok = { Type: token_1.TokenEnum.EOF, Literal: '' };
                break;
            default:
                if (this.isLetter(this.ch)) {
                    tok.Literal = this.readIdentifier();
                    tok.Type = token_1.lookUpIdent(tok.Literal);
                    return tok;
                }
                else if (this.isDigit(this.ch)) {
                    tok.Type = token_1.TokenEnum.INT;
                    tok.Literal = this.readNumber();
                }
                else {
                    tok = { Type: token_1.TokenEnum.ILLEGAL, Literal: this.ch };
                }
        }
        this.readChar();
        return tok;
    }
    readIdentifier() {
        const position = this.position;
        while (this.isLetter(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    readNumber() {
        const position = this.position;
        while (this.isDigit(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }
    isLetter(ch) {
        return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch == '_';
    }
    isDigit(ch) {
        return '0' <= ch && ch <= '9';
    }
    skipWhitespace() {
        while (this.ch === ' ' || this.ch === '\n' || this.ch === '\r') {
            this.readChar();
        }
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lexer.js.map