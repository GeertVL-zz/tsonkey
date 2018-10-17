type ObjectType = string;

export enum ObjectTypeEnum {
    INTEGER_OBJ = 'INTEGER',
    BOOLEAN_OBJ = 'BOOLEAN',
    NULL_OBJ = 'NULL',
    RETURN_VALUE_OBJ = 'RETURN_VALUE'
}

export interface Obj {
    type(): ObjectType;
    inspect(): string;
}

export class Integer implements Obj {
    value: number;

    inspect(): string {
        return `${this.value}`;
    }

    type(): ObjectType {
        return ObjectTypeEnum.INTEGER_OBJ;
    }
}

export class Bool implements Obj {
    value: boolean;

    inspect(): string {
        return `${this.value}`;
    }

    type(): ObjectType {
        return ObjectTypeEnum.BOOLEAN_OBJ;
    }
}

export class Null implements Obj {
    inspect(): string {
        return 'null';
    }

    type(): ObjectType {
        return ObjectTypeEnum.NULL_OBJ;
    }
}

export class ReturnValue implements Obj {
    value: Obj;

    inspect(): string {
        return this.value.inspect();
    }

    type(): ObjectType {
        return ObjectTypeEnum.RETURN_VALUE_OBJ;
    }
}