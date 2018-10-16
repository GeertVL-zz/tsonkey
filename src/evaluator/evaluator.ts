import * as ast from '../ast/ast';
import { Integer, Obj, Bool, Null, ObjectTypeEnum } from '../object/object';

export const TRUE = Object.assign(new Bool(), { value: true });
export const FALSE = Object.assign(new Bool(), { value: false });
export const NULL = new Null();

export function Eval(node: ast.Node): Obj {
    if (node instanceof ast.Program) {
        return evalStatements((<ast.Program>node).statements);
    }

    if (node instanceof ast.ExpressionStatement) {
        return Eval((<ast.ExpressionStatement>node).expression);
    }

    if (node instanceof ast.IntegerLiteral) {
        return Object.assign(new Integer(), { value: (<ast.IntegerLiteral>node).value });
    }

    if (node instanceof ast.Bool) {
        return nativeBoolToBooleanObject((<ast.Bool>node).value);
    }

    if (node instanceof ast.PrefixExpression) {
        const prefix = (<ast.PrefixExpression>node);
        const right = Eval(prefix.right);
        return evalPrefixExpression(prefix.operator, right);
    }

    if (node instanceof ast.InfixExpression) {
        const infix = <ast.InfixExpression>node;
        const left = Eval(infix.left);
        const right = Eval(infix.right);
        return evalInfixExpression(infix.operator, left, right);
    }

    if (node instanceof ast.BlockStatement) {
        return evalStatements(node.statements);
    }

    if (node instanceof ast.IfExpression) {
        return evalIfExpression(node);
    }

    return null;
}

function evalStatements(stmts: ast.Statement[]): Obj {
    let result: Obj;

    stmts.forEach((stmt) => {
        result = Eval(stmt);
    });

    return result;
}

function nativeBoolToBooleanObject(input: boolean): Bool {
    if (input) {
        return TRUE;
    }

    return FALSE;
}

function evalPrefixExpression(operator: string, right: Obj): Obj {
    switch (operator) {
        case '!':
            return evalBangOperatorExpression(right);
        case '-':
            return evalMinusPrefixOperatorExpression(right);
        default:
            return null;    
    }
}

function evalBangOperatorExpression(right: Obj): Obj {
    switch (right) {
        case TRUE:
            return FALSE;
        case FALSE:
            return TRUE;
        case NULL:
            return TRUE;
        default:
            return FALSE;            
    }
}

function evalMinusPrefixOperatorExpression(right: Obj): Obj {
    if (right.type() !== ObjectTypeEnum.INTEGER_OBJ) {
        return NULL;
    }

    const value = (<Integer>right).value;
    return Object.assign(new Integer(), { value: -value });
}

function evalInfixExpression(operator: string, left: Obj, right: Obj): Obj {
    if (left.type() === ObjectTypeEnum.INTEGER_OBJ && right.type() === ObjectTypeEnum.INTEGER_OBJ) {
        return evalIntegerInfixExpression(operator, left, right);
    }

    if (operator === '==') {
        return nativeBoolToBooleanObject(left === right);
    }

    if (operator === '!=') {
        return nativeBoolToBooleanObject(left !== right);
    }

    return NULL;
}

function evalIntegerInfixExpression(operator: string, left: Obj, right: Obj): Obj {
    const leftVal = (<Integer>left).value;
    const rightVal = (<Integer>right).value;

    switch (operator) {
        case '+':
            return Object.assign(new Integer(), { value: leftVal + rightVal });
        case '-':
            return Object.assign(new Integer(), { value: leftVal - rightVal });                
        case '*':
            return Object.assign(new Integer(), { value: leftVal * rightVal });    
        case '/':
            return Object.assign(new Integer(), { value: leftVal / rightVal });
        case '<':
            return nativeBoolToBooleanObject(leftVal < rightVal);
        case '>':
            return nativeBoolToBooleanObject(leftVal > rightVal);
        case '==':
            return nativeBoolToBooleanObject(leftVal == rightVal);
        case '!=':
            return nativeBoolToBooleanObject(leftVal != rightVal);    
    }

    return NULL;
}

function evalIfExpression(ie: ast.IfExpression): Obj {
    const condition = Eval(ie.condition);

    if (isTruthy(condition)) {
        return Eval(ie.consequence);
    } else if (ie.alternative != null) {
        return Eval(ie.alternative);
    } else {
        return NULL;
    }
}

function isTruthy(obj: Obj): boolean {
    switch (obj) {
        case NULL:
            return false;
        case TRUE:
            return true;
        case FALSE:
            return false;
        default:
            return true;    
    }
}