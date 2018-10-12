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

export class InfixExpression implements Expression {
    token: Token;
    left: Expression;
    operator: string;
    right?: Expression;

    expressionNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';

        out = out + '(';
        out = out + this.left.string();
        out = out + ` ${this.operator} `;
        out = out + this.right.string();
        out = out + ')';

        return out;
    }
}

export class Bool implements Expression {
    token: Token;
    value: boolean;

    expressionNode() {}
    
    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        return this.token.Literal;
    }
}

export class IfExpression implements Expression {
    token: Token;
    condition: Expression;
    consequence: BlockStatement;
    alternative: BlockStatement = null;

    expressionNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';

        out = out + 'if';
        out = out + this.condition.string();
        out = out + ' ';
        out = out + this.consequence.string();

        if (this.alternative != null) {
            out = out + 'else ';
            out = out + this.alternative.string();
        }

        return out;
    }
}

export class BlockStatement implements Statement {
    token: Token;
    statements: Statement[];

    statementNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';

        this.statements.forEach((s) => {
            out = out + s.string();
        });

        return out;
    }
}

export class FunctionLiteral implements Expression {
    token: Token;
    parameters: Identifier[];
    body: BlockStatement;

    expressionNode() {}

    tokenLiteral(): string {
        return this.token.Literal;
    }

    string(): string {
        let out: string = '';

        const params: string[] = [];
        this.parameters.forEach((p) => {
            params.push(p.string());
        });

        out = out + this.tokenLiteral();
        out = out + '(';
        out = out + params.join(', ');
        out = out + ')';
        out = out + this.body.string();

        return out;
    }
}

export class CallExpression implements Expression {
    token: Token;
    function: Expression;
    arguments: Expression[];

    expressionNode() {}

    tokenLiteral(): string { 
        return this.token.Literal; 
    }

    string(): string {
        let out: string = '';

        let args = [];

        this.arguments.forEach((arg) => {
            args.push(arg.string());
        });

        out = out + this.function.string();
        out = out + '(';
        out = out + args.join(', ');
        out = out + ')';

        return out;
    }
}