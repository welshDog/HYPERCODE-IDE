import { Position, SourceLocation } from '@hypercode/core';

// In tokenizer.ts
export type TokenType =
  // Literals
  | 'number'
  | 'string'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'regexp'
  | 'template'
  
  // Identifiers
  | 'identifier'
  | 'this'
  | 'super'
  
  // Keywords
  | 'keyword'
  | 'let'
  | 'const'
  | 'var'
  | 'function'
  | 'class'
  | 'if'
  | 'else'
  | 'for'
  | 'while'
  | 'do'
  | 'switch'
  | 'case'
  | 'default'
  | 'break'
  | 'continue'
  | 'return'
  | 'throw'
  | 'try'
  | 'catch'
  | 'finally'
  | 'new'
  | 'delete'
  | 'typeof'
  | 'void'
  | 'instanceof'
  | 'in'
  | 'of'
  | 'yield'
  | 'await'
  
  // Operators
  | 'operator'
  | 'plus'
  | 'minus'
  | 'multiply'
  | 'divide'
  | 'modulus'
  | 'exponent'
  | 'increment'
  | 'decrement'
  | 'bitwiseAnd'
  | 'bitwiseOr'
  | 'bitwiseXor'
  | 'bitwiseNot'
  | 'logicalAnd'
  | 'logicalOr'
  | 'logicalNot'
  | 'nullishCoalescing'
  | 'optionalChaining'
  
  // Punctuation
  | 'punctuation'
  | 'dot'
  | 'comma'
  | 'semicolon'
  | 'colon'
  | 'questionMark'
  | 'leftParen'
  | 'rightParen'
  | 'leftBrace'
  | 'rightBrace'
  | 'leftBracket'
  | 'rightBracket'
  
  // Other
  | 'whitespace'
  | 'comment'
  | 'eof';

export interface Token {
  type: TokenType;
  value: string;
  loc: SourceLocation;
}

export class Tokenizer {
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(private readonly input: string) {}

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token | null;

    while ((token = this.getNextToken())) {
      tokens.push(token);
      if (token.type === 'eof') break;
    }

    return tokens;
  }

  private getNextToken(): Token | null {
    this.skipWhitespace();

    if (this.position >= this.input.length) {
      return this.createToken('eof', '');
    }

    const char = this.input[this.position];

    // Handle numbers
    if (this.isDigit(char)) {
      return this.readNumber();
    }

    // Handle strings
    if (char === '"' || char === "'") {
      return this.readString();
    }

    // Handle identifiers and keywords
    if (this.isIdentifierStart(char)) {
      return this.readIdentifier();
    }

    // Handle operators
    if (this.isOperator(char)) {
      return this.readOperator();
    }

    // Handle punctuation
    if (this.isPunctuation(char)) {
      return this.readPunctuation();
    }

    // Skip comments
    if (char === '/' && this.input[this.position + 1] === '/') {
      this.skipLineComment();
      return this.getNextToken();
    }

    if (char === '/' && this.input[this.position + 1] === '*') {
      this.skipBlockComment();
      return this.getNextToken();
    }

    // Unknown character
    this.advance();
    return this.createToken('punctuation', char);
  }

  private readNumber(): Token {
    let value = '';
    let hasDecimal = false;
    const start = this.currentPosition();

    while (this.position < this.input.length) {
      const char = this.input[this.position];
      
      if (this.isDigit(char)) {
        value += char;
        this.advance();
      } else if (char === '.' && !hasDecimal) {
        value += char;
        hasDecimal = true;
        this.advance();
      } else {
        break;
      }
    }

    return this.createToken('number', value, start);
  }

  private readString(): Token {
    const quote = this.input[this.position];
    let value = '';
    const start = this.currentPosition();
    
    this.advance(); // Skip opening quote

    while (this.position < this.input.length && this.input[this.position] !== quote) {
      value += this.input[this.position];
      this.advance();
    }

    if (this.input[this.position] !== quote) {
      throw new Error('Unterminated string literal');
    }

    this.advance(); // Skip closing quote
    return this.createToken('string', value, start);
  }

  private readIdentifier(): Token {
    let value = '';
    const start = this.currentPosition();

    while (this.position < this.input.length && this.isIdentifierPart(this.input[this.position])) {
      value += this.input[this.position];
      this.advance();
    }

    const type = this.isKeyword(value) ? 'keyword' : 'identifier';
    return this.createToken(type, value, start);
  }

  private readOperator(): Token {
    let value = '';
    const start = this.currentPosition();

    while (this.position < this.input.length && this.isOperator(this.input[this.position])) {
      value += this.input[this.position];
      this.advance();
    }

    return this.createToken('operator', value, start);
  }

  private readPunctuation(): Token {
    const char = this.input[this.position];
    const start = this.currentPosition();
    this.advance();
    return this.createToken('punctuation', char, start);
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && this.isWhitespace(this.input[this.position])) {
      if (this.input[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
  }

  private skipLineComment(): void {
    while (this.position < this.input.length && this.input[this.position] !== '\n') {
      this.advance();
    }
    this.advance(); // Skip the newline
  }

  private skipBlockComment(): void {
    this.advance(); // Skip '/'
    this.advance(); // Skip '*'

    while (this.position < this.input.length - 1) {
      if (this.input[this.position] === '*' && this.input[this.position + 1] === '/') {
        this.advance(); // Skip '*'
        this.advance(); // Skip '/'
        return;
      }
      this.advance();
    }

    throw new Error('Unterminated block comment');
  }

  private advance(): void {
    if (this.input[this.position] === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  private createToken(
    type: TokenType,
    value: string,
    start: Position = this.currentPosition(),
    end: Position = { line: this.line, column: this.column }
  ): Token {
    return {
      type,
      value,
      loc: { start, end }
    };
  }

  private currentPosition(): Position {
    return { line: this.line, column: this.column };
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isIdentifierStart(char: string): boolean {
    return /[a-zA-Z_$]/.test(char);
  }

  private isIdentifierPart(char: string): boolean {
    return /[a-zA-Z0-9_$]/.test(char);
  }

  private isOperator(char: string): boolean {
    return /[+\-*/%&|<>=!?]/.test(char);
  }

  private isPunctuation(char: string): boolean {
    return /[(){}\[\],;:.]/.test(char);
  }

  private isWhitespace(char: string): boolean {
    return /[\s\t\n\r]/.test(char);
  }

  private isKeyword(word: string): boolean {
    const keywords = [
      'function', 'let', 'const', 'var', 'if', 'else', 'return',
      'for', 'while', 'do', 'break', 'continue', 'true', 'false',
      'null', 'undefined', 'this', 'new', 'class', 'extends', 'super',
      'import', 'export', 'default', 'as', 'from', 'type', 'interface'
    ];
    return keywords.includes(word);
  }
}
