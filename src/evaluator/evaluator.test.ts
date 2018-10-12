import { Lexer } from "../lexer/lexer";
import { Parser } from "../parser/parser";
import { Obj, Integer, Bool } from "../object/object";
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

test('eval boolean expression', () => {
    const tests = [
        { input: 'true', expected: true },
        { input: 'false', expected: false }
    ];

    tests.forEach((tt) => {
        const evaluated = testEval(tt.input);
        testBooleanObject(evaluated, tt.expected);
    });
});

test('bang operator', () => {
    const tests = [
        { input: '!true', expected: false },
        { input: '!false', expected: true },
        { input: '!5', expected: false },
        { input: '!!true', expected: true },
        { input: '!!false', expected: false },
        { input: '!!5', expected: true }
    ];

    tests.forEach((tt) => {
        const evaluated = testEval(tt.input);
        testBooleanObject(evaluated, tt.expected);
    });
});

function testEval(input: string): Obj {
    const l = new Lexer(input);
    const p = new Parser(l);
    const program = p.parseProgram();

    return Eval(program);
}

function testIntegerObject(obj: Obj, expected: number): void {
    expect(obj).toBeInstanceOf(Integer);
    const result = <Integer>obj;
    expect(result.value).toBe(expected);
}

function testBooleanObject(obj: Obj, expected: boolean): void {
    expect(obj).toBeInstanceOf(Bool);
    const result = <Bool>obj;
    expect(result.value).toBe(expected);
}