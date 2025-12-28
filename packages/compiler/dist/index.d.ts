import { Tokenizer } from './tokenizer';
import { Parser } from './parser';
import * as AST from '@hypercode/core';
export declare function compile(source: string): AST.Program;
export { Tokenizer, Parser };
