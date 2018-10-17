import { Lexer } from "../lexer/lexer";
import { Parser } from "../parser/parser";
import { Obj, Integer, Bool } from "../object/object";
import { Eval, NULL } from "./evaluator";

test('eval integer expression', () => {
    const tests = [
        { input: '5', expected: 5 },
        { input: '10', expected: 10 },
        { input: '-5', expected: -5 },
        { input: '-10', expected: -10 },
        { input: '5 + 5 + 5 + 5 - 10', expected: 10 }, 
        { input: '2 * 2 * 2 * 2 * 2', expected: 32 }, 
        { input: '-50 + 100 + -50', expected: 0 }, 
        { input: '5 * 2 + 10', expected: 20 }, 
        { input: '5 + 2 * 10', expected: 25 }, 
        { input: '20 + 2 * -10', expected: 0 }, 
        { input: '50 / 2 * 2 + 10', expected: 60 }, 
        { input: '2 * (5 + 10)', expected: 30 }, 
        { input: '3 * 3 * 3 + 10', expected: 37 }, 
        { input: '3 * (3 * 3) + 10', expected: 37 }, 
        { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
    ];

    tests.forEach((tt) => {
        const evaluated = testEval(tt.input);
        testIntegerObject(evaluated, tt.expected);
    });
});

test('eval boolean expression', () => {
    const tests = [
        { input: 'true', expected: true },
        { input: 'false', expected: false },
        { input: '1 < 2', expected: true },
        { input: '1 > 2', expected: false }, 
        { input: '1 < 1', expected: false }, 
        { input: '1 > 1', expected: false }, 
        { input: '1 == 1', expected: true }, 
        { input: '1 != 1', expected: false }, 
        { input: '1 == 2', expected: false }, 
        { input: '1 != 2', expected: true },
        { input: 'true == true', expected: true },
        { input: 'false == false', expected: true }, 
        { input: 'true == false', expected: false }, 
        { input: 'true != false', expected: true }, 
        { input: 'false != true', expected: true }, 
        { input: '(1 < 2) == true', expected: true }, 
        { input: '(1 < 2) == false', expected: false }, 
        { input: '(1 > 2) == true', expected: false }, 
        { input: '(1 > 2) == false', expected: true },
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

test('if else expressions', () => {
    const tests = [
        { input: 'if (true) { 10 }', expected: 10 }, 
        { input: 'if (false) { 10 }', expected: null }, 
        { input: 'if (1) { 10 }', expected: 10 }, 
        { input: 'if (1 < 2) { 10 }', expected: 10 }, 
        { input: 'if (1 > 2) { 10 }', expected: null }, 
        { input: 'if (1 > 2) { 10 } else { 20 }', expected: 20 }, 
        { input: 'if (1 < 2) { 10 } else { 20 }', expected: 10 },
    ];

    tests.forEach((tt) => {
        const evaluated = testEval(tt.input);
        if (tt.expected != null) {
            testIntegerObject(evaluated, tt.expected);
        } else {
            testNullObject(evaluated);
        }
    })
});

test('return statements', () => {
    const tests = [
        { input: 'return 10;', expected: 10 },
        { input: 'return 10; 9;', expected: 10 },
        { input: 'return 2 * 5; 9;', expected: 10 },
        { input: '9; return 2 * 5; 9;', expected: 10 }
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

function testNullObject(obj: Obj): void {
    expect(obj).toBe(NULL);
}