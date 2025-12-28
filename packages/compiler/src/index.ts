import { Tokenizer } from './tokenizer';
import { Parser } from './parser';
import * as AST from '@hypercode/core';

export function compile(source: string): AST.Program {
  const tokenizer = new Tokenizer(source);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

export { Tokenizer, Parser };
