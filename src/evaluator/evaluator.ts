import * as ast from '../ast/ast';
import { Integer, Obj, Bool } from '../object/object';

const TRUE = Object.assign(new Bool(), { value: true });
const FALSE = Object.assign(new Bool(), { value: false });

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