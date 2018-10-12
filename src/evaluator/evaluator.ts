import * as ast from '../ast/ast';
import { Integer, Obj, Bool, Null } from '../object/object';

const TRUE = Object.assign(new Bool(), { value: true });
const FALSE = Object.assign(new Bool(), { value: false });
const NULL = new Null();

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