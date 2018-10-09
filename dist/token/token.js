"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenEnum;
(function (TokenEnum) {
    TokenEnum[TokenEnum["ILLEGAL"] = 0] = "ILLEGAL";
    TokenEnum[TokenEnum["EOF"] = 1] = "EOF";
    // identifiers + literals
    TokenEnum[TokenEnum["IDENT"] = 2] = "IDENT";
    TokenEnum[TokenEnum["INT"] = 3] = "INT";
    // operators
    TokenEnum[TokenEnum["ASSIGN"] = 4] = "ASSIGN";
    TokenEnum[TokenEnum["PLUS"] = 5] = "PLUS";
    // delimiters
    TokenEnum[TokenEnum["COMMA"] = 6] = "COMMA";
    TokenEnum[TokenEnum["SEMICOLON"] = 7] = "SEMICOLON";
    TokenEnum[TokenEnum["LPAREN"] = 8] = "LPAREN";
    TokenEnum[TokenEnum["RPAREN"] = 9] = "RPAREN";
    TokenEnum[TokenEnum["LBRACE"] = 10] = "LBRACE";
    TokenEnum[TokenEnum["RBRACE"] = 11] = "RBRACE";
    // keywords
    TokenEnum[TokenEnum["FUNCTION"] = 12] = "FUNCTION";
    TokenEnum[TokenEnum["LET"] = 13] = "LET";
})(TokenEnum = exports.TokenEnum || (exports.TokenEnum = {}));
exports.keywords = {};
exports.keywords['fn'] = TokenEnum.FUNCTION;
exports.keywords['let'] = TokenEnum.LET;
function lookUpIdent(ident) {
    if (exports.keywords[ident] != undefined) {
        return exports.keywords[ident];
    }
    return TokenEnum.IDENT;
}
exports.lookUpIdent = lookUpIdent;
//# sourceMappingURL=token.js.map