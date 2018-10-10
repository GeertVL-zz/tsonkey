import { Token } from "../token/token";

export interface Node {
    tokenLiteral(): string;
    string(): string;
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

    string(): string {
        return this.statements
            .reduce((acc, stmt) => acc + stmt.string(), '');
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

    string(): string {
        let out: string = '';
        out = out + this.tokenLiteral() + ' ';
        out = out + this.name.string();
        out = out + ' = ';

        if (this.value !== null) {
            out = out + this.value.string();
        }

        out = out + ';';

        return out;
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

    string(): string {
        return this.value;
    }
}

export class ReturnStatement implements Statement {
    public returnValue: Expression;

    constructor(
        public token: Token,
    ) {}

    statementNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';
        out = out + this.tokenLiteral() + ' ';

        if (this.returnValue != null) {
            out = out + this.returnValue.string();
        }

        out = out + ';';

        return out;
    }
}

export class ExpressionStatement implements Statement {
    token: Token;
    expression: Expression;

    statementNode() {}    
    
    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        if (this.expression != null) {
            return this.expression.string();
        }

        return '';
    }
}

export class IntegerLiteral implements Expression {
    token: Token;
    value: number;

    expressionNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        return this.token.Literal;
    }
}

export class PrefixExpression implements Expression {
    token: Token;
    operator: string;
    right: Expression;

    expressionNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';

        out = out + '(';
        out = out + this.operator;
        out = out + this.right.string();
        out = out + ')';

        return out;
    }
}