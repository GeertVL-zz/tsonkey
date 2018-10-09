import { Token, TokenEnum, lookUpIdent } from "../token/token";

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
        let tok: Token = {};

        this.skipWhitespace();

        switch (this.ch) {
            case '=':
                if (this.peekChar() == '=') {
                    const ch = this.ch;
                    this.readChar();
                    const literal = ch + this.ch;
                    tok = { Type: TokenEnum.EQ, Literal: literal };
                } else {
                    tok = { Type: TokenEnum.ASSIGN, Literal: this.ch };
                }
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
            case '-':
                tok = { Type: TokenEnum.MINUS, Literal: this.ch };
                break;
            case '!':
                if (this.peekChar() == '=') {
                    const ch = this.ch;
                    this.readChar();
                    const literal = ch + this.ch;
                    tok = { Type: TokenEnum.NOT_EQ, Literal: literal };
                } else {
                    tok = { Type: TokenEnum.BANG, Literal: this.ch };
                }
                break;
            case '/':
                tok = { Type: TokenEnum.SLASH, Literal: this.ch };
                break;
            case '*': 
                tok = { Type: TokenEnum.ASTERISK, Literal: this.ch };
                break;
            case '<': 
                tok = { Type: TokenEnum.LT, Literal: this.ch };
                break;
            case '>':
                tok = { Type: TokenEnum.GT, Literal: this.ch };
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
            default:
                if  (this.isLetter(this.ch)) {
                    tok.Literal = this.readIdentifier();
                    tok.Type = lookUpIdent(tok.Literal);
                    return tok;
                } else if (this.isDigit(this.ch)) {
                    tok.Type = TokenEnum.INT;
                    tok.Literal = this.readNumber();
                    return tok;
                } else {
                    tok = { Type: TokenEnum.ILLEGAL, Literal: this.ch  };
                } 
        }

        this.readChar();
        return tok;
    }

    peekChar(): string {
        if (this.readPosition >= this.input.length) {
            return '\0';
        } else {
            return this.input[this.readPosition];
        }
    }

    readIdentifier(): string {
        const position = this.position;
        while (this.isLetter(this.ch)) {
            this.readChar();
        }
        return this.input.substring(position, this.position);
    }

    readNumber(): string {
        const position = this.position;
        while (this.isDigit(this.ch)) {
            this.readChar();
        }

        return this.input.substring(position, this.position);
    }

    isLetter(ch: string): boolean {
        return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch == '_';
    }

    isDigit(ch: string): boolean {
        
        return '0' <= ch && ch <= '9';
    }

    skipWhitespace(): void {
        while (this.ch === ' ' || this.ch === '\n' || this.ch === '\r') {
            this.readChar();
        }
    }
}