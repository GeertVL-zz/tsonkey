import * as obj from '../object/object';
import { newError } from './evaluator';

export const builtinFunctions: Map<string, obj.Builtin> 
    = new Map([
        [
            'len', 
            Object.assign(
                new obj.Builtin(), 
                { 
                    fn: function(...args: obj.Object[]): obj.Object {
                        if (args.length !== 1) {
                            return newError(`wrong number of arguments. got=${args.length}, want=1`);
                        }

                        if (args[0] instanceof obj.String) {
                            const value = (<obj.String>args[0]).value;
                            return Object.assign(new obj.Integer(), { value: value.length });
                        }

                        return newError(`argument to 'len' not supported, got ${args[0].type()}`);
                    }
                })
        ]
    ]);