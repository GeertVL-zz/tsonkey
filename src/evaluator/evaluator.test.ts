import { Lexer } from "../lexer/lexer";
import { Parser } from "../parser/parser";
import { Obj, Integer } from "../object/object";
import { Eval } from "./evaluator";

test('eval integer expression', () => {
    const tests = [
        { input: '5', expected: 5 },
        { input: '10', expected: 10 }
    ];

    tests.forEach((tt) => {
        const evaluated = testEval(tt.input);
        testIntegerObject(evaluated, tt.expected);
    });
});

function testEval(input: string): Obj {
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();

    return Eval(program);
}

function testIntegerObject(obj: Object, expected: number): void {
    expect(obj).toBeInstanceOf(Integer);
    const result = <Integer>obj;
    expect(result.value).toBe(expected);
}

