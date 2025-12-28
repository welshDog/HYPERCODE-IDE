import { SourceLocation } from '@hypercode/core';
export type TokenType = 'number' | 'string' | 'boolean' | 'null' | 'undefined' | 'regexp' | 'template' | 'identifier' | 'this' | 'super' | 'keyword' | 'let' | 'const' | 'var' | 'function' | 'class' | 'if' | 'else' | 'for' | 'while' | 'do' | 'switch' | 'case' | 'default' | 'break' | 'continue' | 'return' | 'throw' | 'try' | 'catch' | 'finally' | 'new' | 'delete' | 'typeof' | 'void' | 'instanceof' | 'in' | 'of' | 'yield' | 'await' | 'operator' | 'plus' | 'minus' | 'multiply' | 'divide' | 'modulus' | 'exponent' | 'increment' | 'decrement' | 'bitwiseAnd' | 'bitwiseOr' | 'bitwiseXor' | 'bitwiseNot' | 'logicalAnd' | 'logicalOr' | 'logicalNot' | 'nullishCoalescing' | 'optionalChaining' | 'punctuation' | 'dot' | 'comma' | 'semicolon' | 'colon' | 'questionMark' | 'leftParen' | 'rightParen' | 'leftBrace' | 'rightBrace' | 'leftBracket' | 'rightBracket' | 'whitespace' | 'comment' | 'eof';
export interface Token {
    type: TokenType;
    value: string;
    loc: SourceLocation;
}
export declare class Tokenizer {
    private readonly input;
    private position;
    private line;
    private column;
    constructor(input: string);
    tokenize(): Token[];
    private getNextToken;
    private readNumber;
    private readString;
    private readIdentifier;
    private readOperator;
    private readPunctuation;
    private skipWhitespace;
    private skipLineComment;
    private skipBlockComment;
    private advance;
    private createToken;
    private currentPosition;
    private isDigit;
    private isIdentifierStart;
    private isIdentifierPart;
    private isOperator;
    private isPunctuation;
    private isWhitespace;
    private isKeyword;
}
