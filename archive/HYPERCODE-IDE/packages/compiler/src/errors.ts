import { Position } from '@hypercode/core';

export class ParserError extends Error {
  constructor(
    message: string,
    public readonly position: Position,
    public readonly source: string
  ) {
    super(message);
    this.name = 'ParserError';
  }

  toString() {
    const { line, column } = this.position;
    const lineContent = this.source.split('\n')[line - 1] || '';
    const pointer = ' '.repeat(column - 1) + '^';
    return `${this.message}\n  at line ${line}, column ${column}\n\n${lineContent}\n${pointer}`;
  }
}