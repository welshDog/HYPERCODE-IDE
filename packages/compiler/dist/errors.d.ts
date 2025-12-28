import { Position } from '@hypercode/core';
export declare class ParserError extends Error {
    readonly position: Position;
    readonly source: string;
    constructor(message: string, position: Position, source: string);
    toString(): string;
}
