import { Lexer } from "../lexer/lexer";
import { Token, TokenEnum } from "../token/token";
import { 
    Program, 
    Statement, 
    LetStatement, 
    Identifier, 
    ReturnStatement, 
    Expression, 
    ExpressionStatement, 
    BlockStatement
} from "../ast/ast";
import * as helper from "./parser-helper";
import { PrecedenceEnum } from "./parser-helper";

type PrefixParseFn = (p: Parser) => Expression;
type InfixParseFn = (p: Parser, e: Expression) => Expression;

const precedences: Map<string, PrecedenceEnum> 
    = new Map(
        [
            [TokenEnum.EQ, PrecedenceEnum.EQUALS],
            [TokenEnum.NOT_EQ, PrecedenceEnum.EQUALS],
            [TokenEnum.LT, PrecedenceEnum.LESSGREATER],
            [TokenEnum.GT, PrecedenceEnum.LESSGREATER],
            [TokenEnum.PLUS, PrecedenceEnum.SUM],
            [TokenEnum.MINUS, PrecedenceEnum.SUM],
            [TokenEnum.SLASH, PrecedenceEnum.PRODUCT],
            [TokenEnum.ASTERISK, PrecedenceEnum.PRODUCT],
            [TokenEnum.LPAREN, PrecedenceEnum.CALL]
        ]);

export class Parser {
    lexer: Lexer;
    curToken: Token;
    peekToken: Token;
    errors: string[] = [];
    prefixParseFns: Map<TokenEnum, PrefixParseFn> = new Map();
    infixParseFns: Map<TokenEnum, InfixParseFn> = new Map();

    constructor(lexer: Lexer) {
        this.lexer = lexer;

        this.registerPrefix(TokenEnum.IDENT, helper.parseIdentifier);
        this.registerPrefix(TokenEnum.INT, helper.parseIntegerLiteral);
        this.registerPrefix(TokenEnum.BANG, helper.parsePrefixExpression);
        this.registerPrefix(TokenEnum.MINUS, helper.parsePrefixExpression);
        this.registerPrefix(TokenEnum.TRUE, helper.parseBoolean);
        this.registerPrefix(TokenEnum.FALSE, helper.parseBoolean);
        this.registerPrefix(TokenEnum.LPAREN, helper.parseGroupedExpression);
        this.registerPrefix(TokenEnum.IF, helper.parseIfExpression);
        this.registerPrefix(TokenEnum.FUNCTION, helper.parseFunctionLiteral);
        this.registerPrefix(TokenEnum.STRING, helper.parseStringLiteral);

        this.registerInfix(TokenEnum.PLUS, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.MINUS, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.SLASH, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.ASTERISK, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.EQ, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.NOT_EQ, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.LT, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.GT, helper.parseInfixExpression);
        this.registerInfix(TokenEnum.LPAREN, helper.parseCallExpression);

        this.nextToken();
        this.nextToken();
    }

    nextToken(): void {
        this.curToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    parseProgram(): Program {
        const program: Program = new Program();
        
        while (this.curToken.Type != TokenEnum.EOF) {
            const stmt = this.parseStatement();
            if (stmt !== null) {
                program.statements.push(stmt);
            }
            this.nextToken();
        }

        return program;
    }

    parseStatement(): Statement {
        switch (this.curToken.Type) {
            case TokenEnum.LET:
                return this.parseLetStatement();
            case TokenEnum.RETURN:
                return this.parseReturnStatement();    
            default:
                return this.parseExpressionStatement();
        }
    }

    parseLetStatement(): LetStatement {
        const stmt = new LetStatement();
        stmt.token = this.curToken;

        if (!this.expectPeek(TokenEnum.IDENT)) {
            return null;
        }

        stmt.name = new Identifier(this.curToken, this.curToken.Literal);

        if (!this.expectPeek(TokenEnum.ASSIGN)) {
            return null;
        }

        this.nextToken();

        stmt.value = this.parseExpression(PrecedenceEnum.LOWEST);

        if (this.peekTokenIs(TokenEnum.SEMICOLON)) {
            this.nextToken();
        }

        return stmt;
    }

    parseReturnStatement(): ReturnStatement {
        const stmt = new ReturnStatement(this.curToken);

        this.nextToken();

        stmt.returnValue = this.parseExpression(PrecedenceEnum.LOWEST);

        if (this.peekTokenIs(TokenEnum.SEMICOLON)) {
            this.nextToken();
        }

        return stmt;
    }

    parseExpressionStatement(): ExpressionStatement {
        const stmt = new ExpressionStatement();
        stmt.token = this.curToken;
        stmt.expression = this.parseExpression(PrecedenceEnum.LOWEST);

        if (this.peekTokenIs(TokenEnum.SEMICOLON)) {
            this.nextToken();
        }

        return stmt;
    }

    parseExpression(precedence: PrecedenceEnum): Expression {
        const prefix = this.prefixParseFns.get(this.curToken.Type);
        if (prefix == null) {
            this.noPrefixParseFnError(this.curToken.Type);
            return null;
        }
        let leftExp = prefix(this);

        while (!this.peekTokenIs(TokenEnum.SEMICOLON) && precedence < this.peekPrecedence()) {
            const infix = this.infixParseFns.get(this.peekToken.Type);
            if (infix == null) {
                return leftExp;
            }

            this.nextToken();

            leftExp = infix(this, leftExp);
        }

        return leftExp;
    }

    parseBlockStatement(): BlockStatement {
        const block = new BlockStatement();
        block.token = this.curToken;
        block.statements = [];

        this.nextToken();

        while (!this.curTokenIs(TokenEnum.RBRACE) && !this.curTokenIs(TokenEnum.EOF)) {
            const stmt = this.parseStatement();
            if (stmt != null) {
                block.statements.push(stmt);
            }

            this.nextToken();
        }

        return block;
    }

    parseFunctionParameters(): Identifier[] {
        const identifiers: Identifier[] = [];

        if (this.peekTokenIs(TokenEnum.RPAREN)) {
            this.nextToken();
            return identifiers;
        }

        this.nextToken();

        const ident = new Identifier(this.curToken, this.curToken.Literal);
        identifiers.push(ident);

        while (this.peekTokenIs(TokenEnum.COMMA)) {
            this.nextToken();
            this.nextToken();
            const ident = new Identifier(this.curToken, this.curToken.Literal);
            identifiers.push(ident);
        }

        if (!this.expectPeek(TokenEnum.RPAREN)) {
            return null;
        }

        return identifiers;
    }

    parseCallArguments(): Expression[] {
        const args: Expression[] = [];

        if (this.peekTokenIs(TokenEnum.RPAREN)) {
            this.nextToken();
            return args;
        }

        this.nextToken();
        args.push(this.parseExpression(PrecedenceEnum.LOWEST));

        while (this.peekTokenIs(TokenEnum.COMMA)) {
            this.nextToken();
            this.nextToken();

            args.push(this.parseExpression(PrecedenceEnum.LOWEST));
        }

        if (!this.expectPeek(TokenEnum.RPAREN)) {
            return null;
        }

        return args;
    }

    // helpers

    curTokenIs(t: TokenEnum): boolean {
        return this.curToken.Type == t;
    }

    peekTokenIs(t: TokenEnum): boolean {
        return this.peekToken.Type == t;
    }

    expectPeek(t: TokenEnum): boolean {
        if (this.peekTokenIs(t)) {
            this.nextToken();
            return true;
        } else {
            this.peekError(t);
            return false;
        }
    }

    peekError(t: TokenEnum) {
        const msg = `expected next token to be ${t}, got ${this.peekToken.Type} instead`;
        this.errors.push(msg);
    }

    registerPrefix(tokenType: TokenEnum, fn: PrefixParseFn): void {
        this.prefixParseFns.set(tokenType, fn);
    }

    registerInfix(tokenType: TokenEnum, fn: InfixParseFn): void {
        this.infixParseFns.set(tokenType, fn);
    }

    noPrefixParseFnError(t: TokenEnum): void {
        const msg = `no prefix parse function for ${t} found`;
        this.errors.push(msg);
    }

    peekPrecedence(): number {
        const p = precedences.get(this.peekToken.Type);
        if (p == null) {
            return PrecedenceEnum.LOWEST;
        }

        return p;
    }

    curPrecedence(): number {
        const p = precedences.get(this.curToken.Type);
        if (p == null) {
            return PrecedenceEnum.LOWEST;
        }

        return p;
    }
}