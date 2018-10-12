import * as readline from 'readline';
import { Lexer } from '../lexer/lexer';
import { TokenEnum } from '../token/token';
import { Parser } from '../parser/parser';

const PROMPT = '>> ';

const i = readline.createInterface(process.stdin, process.stdout, null);

export function Start() {
    while (1 == 1) {
        i.question(PROMPT, (answer) => {
            const l = new Lexer(answer);
            const p = new Parser(l);

            const program = p.parseProgram();
            if (p.errors.length != 0) {
                printParserErrors(p.errors);
            }

            console.log(program.string());
            console.log('\n');
        });
    }

    i.close();
}

function printParserErrors(errors: string[]): void {
    errors.forEach((err) => {
        console.log(`\t{err}\n`);
    });
}