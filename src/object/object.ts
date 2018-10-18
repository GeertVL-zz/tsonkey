import * as ast from '../ast/ast';

type ObjectType = string;

export enum ObjectTypeEnum {
    INTEGER_OBJ = 'INTEGER',
    BOOLEAN_OBJ = 'BOOLEAN',
    NULL_OBJ = 'NULL',
    RETURN_VALUE_OBJ = 'RETURN_VALUE',
    ERROR_OBJ = 'ERROR',
    FUNCTION_OBJ = 'FUNCTION',
}

export interface Object {
    type(): ObjectType;
    inspect(): string;
}

export class Integer implements Object {
    value: number;

    inspect(): string {
        return `${this.value}`;
    }

    type(): ObjectType {
        return ObjectTypeEnum.INTEGER_OBJ;
    }
}

export class Bool implements Object {
    value: boolean;

    inspect(): string {
        return `${this.value}`;
    }

    type(): ObjectType {
        return ObjectTypeEnum.BOOLEAN_OBJ;
    }
}

export class Null implements Object {
    inspect(): string {
        return 'null';
    }

    type(): ObjectType {
        return ObjectTypeEnum.NULL_OBJ;
    }
}

export class ReturnValue implements Object {
    value: Object;

    inspect(): string {
        return this.value.inspect();
    }

    type(): ObjectType {
        return ObjectTypeEnum.RETURN_VALUE_OBJ;
    }
}

export class Error implements Object {
    message: string;

    inspect(): string {
        return `ERROR: ${this.message}`;
    }

    type(): ObjectType {
        return ObjectTypeEnum.ERROR_OBJ;
    }
}

export class Function implements Object {
    parameters: ast.Identifier[];
    body: ast.BlockStatement;
    env: Environment;

    inspect(): string {
        let out: string = '';

        let params: string[] = [];
        this.parameters.forEach((p) => {
            params.push(p.string());
        });

        out = out + 'fn';
        out = out + '(';
        out = out + params.join(', ');
        out = out + ') {\n';
        out = out + this.body.string();
        out = out + '\n}';

        return out;
    }    

    type(): ObjectType {
        return ObjectTypeEnum.FUNCTION_OBJ;
    }
}

export function NewEnclosedEnvironment(outer: Environment): Environment {
    const env = NewEnvironment();
    env.outer = outer;

    return env;
}

export function NewEnvironment(): Environment {
    const ev = new Environment();
    ev.store = new Map();
    return ev;
}

export class Environment {
    store: Map<string, Object>;
    outer: Environment;

    get(name: string): [Object, boolean] {
        const value = this.store.get(name);
        if (value === undefined && this.outer !== undefined) {
            const outerValue = this.outer.get(name);
            return outerValue;
        }

        return [value, value !== undefined];
    }

    set(name: string, value: Object): Object {
        this.store.set(name, value);
        return value;
    }
}