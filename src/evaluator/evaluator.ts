import { Node, IntegerLiteral, Program, ExpressionStatement, Statement } from '../ast/ast';
import { Integer, Obj } from '../object/object';

export function Eval(node: Node): Obj {
    if (node instanceof Program) {
        return evalStatements((<Program>node).statements);
    }

    if (node instanceof ExpressionStatement) {
        return Eval((<ExpressionStatement>node).expression);
    }

    if (node instanceof IntegerLiteral) {
        return Object.assign(new Integer(), { value: (<IntegerLiteral>node).value });
    }

    return null;
}

function evalStatements(stmts: Statement[]): Obj {
    let result: Obj;

    stmts.forEach((stmt) => {
        result = Eval(stmt);
    });

    return result;
}