import * as readline from 'readline';
import { Lexer } from '../lexer/lexer';
import { TokenEnum } from '../token/token';

const PROMPT = '>> ';

const i = readline.createInterface(process.stdin, process.stdout, null);

export function Start() {
    while (1 == 1) {
        i.question(PROMPT, (answer) => {
            const l = new Lexer(answer);

            for (var tok = l.nextToken(); tok.Type != TokenEnum.EOF; tok = l.nextToken()) {
                console.log(`${tok}\n`);
            }
        });
    }

    i.close();
}