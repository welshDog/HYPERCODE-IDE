"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserError = void 0;
class ParserError extends Error {
    constructor(message, position, source) {
        super(message);
        this.position = position;
        this.source = source;
        this.name = 'ParserError';
    }
    toString() {
        const { line, column } = this.position;
        const lineContent = this.source.split('\n')[line - 1] || '';
        const pointer = ' '.repeat(column - 1) + '^';
        return `${this.message}\n  at line ${line}, column ${column}\n\n${lineContent}\n${pointer}`;
    }
}
exports.ParserError = ParserError;
