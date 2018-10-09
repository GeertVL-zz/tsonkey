import { Token } from "../token/token";

export interface Node {
    tokenLiteral(): string;
}

export interface Statement extends Node {
    statementNode();
}

export interface Expression extends Node {
    expressionNode();
}

export class Program implements Node {
    public statements: Statement[] = [];

    tokenLiteral(): string {
        if (this.statements.length > 0) {
            return this.statements[0].tokenLiteral();
        } else {
            return '';
        }
    }
}

export class LetStatement implements Statement {
    public token: Token;
    public name: Identifier;
    public value: Expression; 

    statementNode() {}    
    
    tokenLiteral(): string {
        return this.token.Literal;
    }
}

export class Identifier implements Expression {
    constructor(
        public token: Token, 
        public value: string) {}

    expressionNode() {}
    tokenLiteral(): string {
        return this.token.Literal;
    }    
}