import * as ast from '../ast/ast';
import * as obj from '../object/object';

export const TRUE = Object.assign(new obj.Bool(), { value: true });
export const FALSE = Object.assign(new obj.Bool(), { value: false });
export const NULL = new obj.Null();

export function Eval(node: ast.Node, env: obj.Environment): obj.Object {
    if (node instanceof ast.Program) {
        return evalProgram(node, env);
    }

    if (node instanceof ast.BlockStatement) {
        return evalBlockStatement(node, env);
    }

    if (node instanceof ast.ExpressionStatement) {
        return Eval((<ast.ExpressionStatement>node).expression, env);
    }

    if (node instanceof ast.IntegerLiteral) {
        return Object.assign(new obj.Integer(), { value: (<ast.IntegerLiteral>node).value });
    }

    if (node instanceof ast.Bool) {
        return nativeBoolToBooleanObject((<ast.Bool>node).value);
    }

    if (node instanceof ast.PrefixExpression) {
        const prefix = (<ast.PrefixExpression>node);
        const right = Eval(prefix.right, env);
        if (isError(right)) {
            return right;
        }
        return evalPrefixExpression(prefix.operator, right);
    }

    if (node instanceof ast.InfixExpression) {
        const infix = <ast.InfixExpression>node;
        const left = Eval(infix.left, env);
        if (isError(left)) {
            return left;
        }
        const right = Eval(infix.right, env);
        if (isError(right)) {
            return right;
        }
        return evalInfixExpression(infix.operator, left, right);
    }

    if (node instanceof ast.BlockStatement) {
        return evalStatements(node.statements, env);
    }

    if (node instanceof ast.IfExpression) {
        return evalIfExpression(node, env);
    }

    if (node instanceof ast.ReturnStatement) {
        const val = Eval(node.returnValue, env);
        if (isError(val)) {
            return val;
        }
        const returnValue = new obj.ReturnValue();
        returnValue.value = val;
        return returnValue;
    }

    if (node instanceof ast.LetStatement) {
        const val = Eval(node.value, env);
        if (isError(val)) {
            return val;
        }
        env.set(node.name.value, val);
    }

    if (node instanceof ast.Identifier) {
        return evalIdentifier(node, env);
    }

    if (node instanceof ast.FunctionLiteral) {
        const params = node.parameters;
        const body = node.body;

        return Object.assign(new obj.Function(), { parameters: params, env: env, body: body });
    }

    if (node instanceof ast.CallExpression) {
        const funct = Eval(node.function, env);
        if (isError(funct)) {
            return funct;
        }

        const args = evalExpressions(node.arguments, env);
        if (args.length == 1 && isError(args[0])) {
            return args[0];
        }

        return applyFunction(funct, args);
    }

    return null;
}

function evalProgram(program: ast.Program, env: obj.Environment): obj.Object {
    let result: obj.Object;

    for (let statement of program.statements) {
        result = Eval(statement, env);

        if (result instanceof obj.ReturnValue) {
            return (<obj.ReturnValue>result).value;
        }

        if (result instanceof obj.Error) {
            return result;
        }
    }

    return result;
}

function evalBlockStatement(block: ast.BlockStatement, env: obj.Environment): obj.Object {
    let result: obj.Object;

    for (let statement of block.statements) {
        result = Eval(statement, env);

        if (result != null) {
            if (result.type() === obj.ObjectTypeEnum.RETURN_VALUE_OBJ || result.type() === obj.ObjectTypeEnum.ERROR_OBJ) {
                return result;
            }
        }
    }

    return result;
}

function evalStatements(stmts: ast.Statement[], env: obj.Environment): obj.Object {
    let result: obj.Object;

    stmts.forEach((stmt) => {
           result = Eval(stmt, env);

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

function evalIfExpression(ie: ast.IfExpression, env: obj.Environment): obj.Object {
    const condition = Eval(ie.condition, env);
    if (isError(condition)) {
        return condition;
    }

    if (isTruthy(condition)) {
        return Eval(ie.consequence, env);
    } else if (ie.alternative != null) {
        return Eval(ie.alternative, env);
    } else {
        return NULL;
    }
}

function evalIdentifier(node: ast.Identifier, env: obj.Environment): obj.Object {
    const value = env.get(node.value);
    if (!value[1]) {
        return newError(`identifier not found: ${node.value}`);
    }

    return value[0];
}

function evalExpressions(exps: ast.Expression[], env: obj.Environment): obj.Object[] {
    let result: obj.Object[] = [];

    for (let e of exps) {
        const evaluated = Eval(e, env);
        if (isError(evaluated)) {
            return [ evaluated ];
        }

        result.push(evaluated);
    }

    return result;
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

function isError(object: obj.Object): boolean {
    if (object != null) {
        return object.type() === obj.ObjectTypeEnum.ERROR_OBJ;
    }

    return false;
}

function applyFunction(fn: obj.Object, args: obj.Object[]): obj.Object {
    if (!(fn instanceof obj.Function)) {
        return newError(`not a function: ${fn.type()}`);
    }

    const funct = <obj.Function>fn;

    const extendedEnv = extendFunctionEnv(funct, args);
    const evaluated = Eval(funct.body, extendedEnv);
    return unwrapReturnValue(evaluated);
}

function extendFunctionEnv(fn: obj.Function, args: obj.Object[]): obj.Environment {
    const env = obj.NewEnclosedEnvironment(fn.env);

    fn.parameters.forEach((parm, idx) => {
        env.set(parm.value, args[idx]);
    });

    return env;
}

function unwrapReturnValue(object: obj.Object): obj.Object {
    if (object instanceof obj.ReturnValue) {
        return ((<obj.ReturnValue>object).value);
    }

    return object;
}