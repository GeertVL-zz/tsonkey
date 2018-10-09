import { Lexer } from "../lexer/lexer";
import { Token, TokenEnum } from "../token/token";
import { Program, Statement, LetStatement, Identifier } from "../ast/ast";

export class Parser {
    lexer: Lexer;
    curToken: Token;
    peekToken: Token;

    constructor(lexer: Lexer) {
        this.lexer = lexer;

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
            default:
                return null;
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

        while (!this.curTokenIs(TokenEnum.SEMICOLON)) {
            this.nextToken();
        }

        return stmt;
    }

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
            return false;
        }
    }
}