type TokenType = string;

export interface Token {
    Type: TokenEnum;
    Literal: string;
}

export enum TokenEnum {
    ILLEGAL,
    EOF,

    // identifiers + literals
    IDENT,
    INT,

    // operators
    ASSIGN,
    PLUS,

    // delimiters
    COMMA,
    SEMICOLON,

    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,

    // keywords
    FUNCTION,
    LET,
}
