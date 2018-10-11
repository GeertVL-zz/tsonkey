import { Parser } from "./parser";
import { Expression, IfExpression, IntegerLiteral, Identifier, PrefixExpression, InfixExpression, Bool } from "../ast/ast";
import { TokenEnum } from "../token/token";

export enum PrecedenceEnum {
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL
}

export function parseIntegerLiteral(p: Parser): Expression {
    const lit = new IntegerLiteral();
    lit.token = p.curToken;
    lit.value = parseInt(p.curToken.Literal);

    return lit;
}

export function parseIdentifier(p: Parser): Expression {
    return new Identifier(p.curToken, p.curToken.Literal);
}

export function parsePrefixExpression(p: Parser): Expression {
    const expression = new PrefixExpression();
    expression.token = p.curToken;
    expression.operator = p.curToken.Literal;

    p.nextToken();

    expression.right = p.parseExpression(PrecedenceEnum.PREFIX);

    return expression;
}

export function parseInfixExpression(p: Parser, e: Expression): Expression {
    const expression = new InfixExpression();
    expression.token = p.curToken;
    expression.operator = p.curToken.Literal;
    expression.left = e;

    const precedence = p.curPrecedence();
    p.nextToken();
    expression.right = p.parseExpression(precedence);

    return expression;
}

export function parseBoolean(p: Parser): Expression {
    const bool = new Bool();
    bool.token = p.curToken;
    bool.value = p.curTokenIs(TokenEnum.TRUE);

    return bool;
}

export function parseGroupedExpression(p: Parser): Expression {
    p.nextToken();

    const exp = p.parseExpression(PrecedenceEnum.LOWEST);
    if (!p.expectPeek(TokenEnum.RPAREN)) {
        return null;
    }

    return exp;
}

export function parseIfExpression(p: Parser): Expression {
    const expression = new IfExpression();
    expression.token = p.curToken;

    if (!p.expectPeek(TokenEnum.LPAREN)) {
        return null;
    }

    p.nextToken();
    expression.condition = p.parseExpression(PrecedenceEnum.LOWEST);

    if (!p.expectPeek(TokenEnum.RPAREN)) {
        return null;
    }

    if (!p.expectPeek(TokenEnum.LBRACE)) {
        return null;
    }

    expression.consequence = p.parseBlockStatement();

    if (p.peekTokenIs(TokenEnum.ELSE)) {
        p.nextToken();

        if (!p.expectPeek(TokenEnum.LBRACE)) {
            return null;
        }

        expression.alternative = p.parseBlockStatement();
    }

    return expression;
}