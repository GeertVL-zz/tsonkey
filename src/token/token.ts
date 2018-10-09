type TokenType = string;

export interface HashSet<T> {
    [key: string]: T;
}

export interface Token {
    Type?: TokenEnum;
    Literal?: string;
}

export enum TokenEnum {
    ILLEGAL = "ILLEGAL",
    EOF = "EOF",

    // identifiers + literals
    IDENT = "IDENT",
    INT = "INT",

    // operators
    ASSIGN = "ASSIGN",
    PLUS = "PLUS",

    // delimiters
    COMMA = "COMMA",
    SEMICOLON = "SEMICOLON",

    LPAREN = "LPAREN",
    RPAREN = "RPAREN",
    LBRACE = "LBRACE",
    RBRACE = "RBRACE",

    // keywords
    FUNCTION = "FUNCTION",
    LET = "LET",
}

export const keywords: HashSet<TokenEnum> = {};
keywords['fn'] = TokenEnum.FUNCTION;
keywords['let'] = TokenEnum.LET;

export function lookUpIdent(ident: string): TokenEnum {
    // console.log(`lookup ${ident}`);
    // console.log(`keywords ${keywords[ident]}`);
    if (keywords[ident] != undefined) {
        return keywords[ident];
    }

    return TokenEnum.IDENT;
}

