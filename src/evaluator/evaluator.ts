import * as ast from '../ast/ast';
import * as obj from '../object/object';

export const TRUE = Object.assign(new obj.Bool(), { value: true });
export const FALSE = Object.assign(new obj.Bool(), { value: false });
export const NULL = new obj.Null();

export function Eval(node: ast.Node): obj.Object {
    if (node instanceof ast.Program) {
        return evalProgram(node);
    }

    if (node instanceof ast.BlockStatement) {
        return evalBlockStatement(node);
    }

    if (node instanceof ast.ExpressionStatement) {
        return Eval((<ast.ExpressionStatement>node).expression);
    }

    if (node instanceof ast.IntegerLiteral) {
        return Object.assign(new obj.Integer(), { value: (<ast.IntegerLiteral>node).value });
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

    if (node instanceof ast.ReturnStatement) {
        const val = Eval(node.returnValue);
        const returnValue = new obj.ReturnValue();
        returnValue.value = val;
        return returnValue;
    }

    return null;
}

function evalProgram(program: ast.Program): obj.Object {
    let result: obj.Object;

    for (let statement of program.statements) {
        result = Eval(statement);

        if (result instanceof obj.ReturnValue) {
            return (<obj.ReturnValue>result).value;
        }

        if (result instanceof obj.Error) {
            return result;
        }
    }

    return result;
}

function evalBlockStatement(block: ast.BlockStatement): obj.Object {
    let result: obj.Object;

    for (let statement of block.statements) {
        result = Eval(statement);

        if (result != null) {
            if (result.type() === obj.ObjectTypeEnum.RETURN_VALUE_OBJ || result.type() === obj.ObjectTypeEnum.ERROR_OBJ) {
                return result;
            }
        }
    }

    return result;
}

function evalStatements(stmts: ast.Statement[]): obj.Object {
    let result: obj.Object;

    stmts.forEach((stmt) => {
           result = Eval(stmt);

        if (result instanceof obj.ReturnValue) {
            return (<obj.ReturnValue>result).value;
        }
    });

    return result;
}

function nativeBoolToBooleanObject(input: boolean): obj.Bool {
    if (input) {
        return TRUE;
    }

    return FALSE;
}

function evalPrefixExpression(operator: string, right: obj.Object): obj.Object {
    switch (operator) {
        case '!':
            return evalBangOperatorExpression(right);
        case '-':
            return evalMinusPrefixOperatorExpression(right);
        default:
            return newError(`unknown operator: ${operator} ${right.type()}`);    
    }
}

function evalBangOperatorExpression(right: obj.Object): obj.Object {
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

function evalMinusPrefixOperatorExpression(right: obj.Object): obj.Object {
    if (right.type() !== obj.ObjectTypeEnum.INTEGER_OBJ) {
        return newError(`unknown operator: -${right.type()}`);
    }

    const value = (<obj.Integer>right).value;
    return Object.assign(new obj.Integer(), { value: -value });
}

function evalInfixExpression(operator: string, left: obj.Object, right: obj.Object): obj.Object {
    if (left.type() === obj.ObjectTypeEnum.INTEGER_OBJ && right.type() === obj.ObjectTypeEnum.INTEGER_OBJ) {
        return evalIntegerInfixExpression(operator, left, right);
    }

    if (operator === '==') {
        return nativeBoolToBooleanObject(left === right);
    }

    if (operator === '!=') {
        return nativeBoolToBooleanObject(left !== right);
    }

    if (left.type() !== right.type()) {
        return newError(`type mismatch: ${left.type()} ${operator} ${right.type()}`);
    }

    return newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
}

function evalIntegerInfixExpression(operator: string, left: obj.Object, right: obj.Object): obj.Object {
    const leftVal = (<obj.Integer>left).value;
    const rightVal = (<obj.Integer>right).value;

    switch (operator) {
        case '+':
            return Object.assign(new obj.Integer(), { value: leftVal + rightVal });
        case '-':
            return Object.assign(new obj.Integer(), { value: leftVal - rightVal });                
        case '*':
            return Object.assign(new obj.Integer(), { value: leftVal * rightVal });    
        case '/':
            return Object.assign(new obj.Integer(), { value: leftVal / rightVal });
        case '<':
            return nativeBoolToBooleanObject(leftVal < rightVal);
        case '>':
            return nativeBoolToBooleanObject(leftVal > rightVal);
        case '==':
            return nativeBoolToBooleanObject(leftVal == rightVal);
        case '!=':
            return nativeBoolToBooleanObject(leftVal != rightVal);    
    }

    return newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
}

function evalIfExpression(ie: ast.IfExpression): obj.Object {
    const condition = Eval(ie.condition);

    if (isTruthy(condition)) {
        return Eval(ie.consequence);
    } else if (ie.alternative != null) {
        return Eval(ie.alternative);
    } else {
        return NULL;
    }
}

function isTruthy(object: obj.Object): boolean {
    switch (object) {
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

function newError(message: string): obj.Error {
    return Object.assign(new obj.Error(), { message: message });
}