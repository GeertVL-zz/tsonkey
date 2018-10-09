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
    MINUS = "MINUS",
    BANG = "!",
    ASTERISK = "*",
    SLASH = "/",

    LT = "<",
    GT = ">",

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
    TRUE = "TRUE",
    FALSE = "FALSE",
    IF = "IF",
    ELSE = "ELSE",
    RETURN = "RETURN",

    EQ = "==",
    NOT_EQ = "!="
}

export const keywords: HashSet<TokenEnum> = {};
keywords['fn'] = TokenEnum.FUNCTION;
keywords['let'] = TokenEnum.LET;
keywords['true'] = TokenEnum.TRUE;
keywords['false'] = TokenEnum.FALSE;
keywords['if'] = TokenEnum.IF;
keywords['else'] = TokenEnum.ELSE;
keywords['return'] = TokenEnum.RETURN;

export function lookUpIdent(ident: string): TokenEnum {
    if (keywords[ident] != undefined) {
        return keywords[ident];
    }

    return TokenEnum.IDENT;
}

