import { Token, TokenEnum } from "../token/token";

export class Lexer {
    public input: string;
    public position: number;
    public readPosition: number = 0;
    public ch: string;

    constructor(input: string) {
        this.input = input;
        this.readChar();
    }

    readChar(): void {
        if (this.readPosition >= this.input.length) {
            this.ch = '\0';
        } else {
            this.ch = this.input[this.readPosition];
        }
        this.position = this.readPosition;
        this.readPosition += 1;
    }

    nextToken(): Token {
        let tok: Token;

        switch (this.ch) {
            case '=':
                tok = { Type: TokenEnum.ASSIGN, Literal: this.ch };
                break;
            case ';':
                tok = { Type: TokenEnum.SEMICOLON, Literal: this.ch };
                break;
            case '(':
                tok = { Type: TokenEnum.LPAREN, Literal: this.ch };
                break;
            case ')':
                tok = { Type: TokenEnum.RPAREN, Literal: this.ch };
                break;
            case ',':
                tok = { Type: TokenEnum.COMMA, Literal: this.ch };
                break;
            case '+':
                tok = { Type: TokenEnum.PLUS, Literal: this.ch };
                break;        
            case '{':
                tok = { Type: TokenEnum.LBRACE, Literal: this.ch };
                break;
            case '}':
                tok = { Type: TokenEnum.RBRACE, Literal: this.ch };
                break;
            case '\0':
                tok = { Type: TokenEnum.EOF, Literal: '' };
                break;
        }

        this.readChar();
        return tok;
    }
}