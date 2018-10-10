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

export const keywords: Map<string, TokenEnum> = new Map(
    [
        ['fn', TokenEnum.FUNCTION],
        ['let', TokenEnum.LET],
        ['true', TokenEnum.TRUE],
        ['false', TokenEnum.FALSE],
        ['if', TokenEnum.IF],
        ['else', TokenEnum.ELSE],
        ['return', TokenEnum.RETURN]
    ]
);

export function lookUpIdent(ident: string): TokenEnum {
    if (this.keywords.get(ident) != undefined) {
        return this.keywords.get(ident);
    }

    return TokenEnum.IDENT;
}

