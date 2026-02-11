import { Token, TokenType } from './tokenizer';
import * as AST from '@hypercode/core';
import { ParserError } from './errors'; // We'll create this for better error handling

export class Parser {
  private position: number = 0;
  private readonly tokens: Token[];
  private source: string;

  constructor(tokens: Token[], source: string) {
    this.tokens = tokens;
    this.source = source;
  }

  parse(): AST.Program {
    const program: AST.Program = {
      type: 'Program',
      body: [],
      loc: this.createLocation({ line: 1, column: 1 }, { line: 1, column: 1 })
    };

    try {
      while (!this.isAtEnd()) {
        const stmt = this.parseStatement();
        if (stmt) {
          program.body.push(stmt);
        }
      }
    } catch (error) {
      if (error instanceof ParserError) {
        console.error(error.toString());
      }
      throw error;
    }

    return program;
  }

  private parseStatement(): AST.Statement | null {
    try {
      if (this.match('keyword', 'let') || 
          this.match('keyword', 'const') || 
          this.match('keyword', 'var')) {
        return this.parseVariableDeclaration();
      }

      if (this.match('keyword', 'function')) {
        return this.parseFunctionDeclaration();
      }

      if (this.match('keyword', 'class')) {
        return this.parseClassDeclaration();
      }

      if (this.match('punctuation', '{')) {
        return this.parseBlockStatement();
      }

      if (this.match('keyword', 'if')) {
        return this.parseIfStatement();
      }

      if (this.match('keyword', 'for')) {
        return this.parseForStatement();
      }

      if (this.match('keyword', 'while')) {
        return this.parseWhileStatement();
      }

      if (this.match('keyword', 'do')) {
        return this.parseDoWhileStatement();
      }

      if (this.match('keyword', 'switch')) {
        return this.parseSwitchStatement();
      }

      if (this.match('keyword', 'return')) {
        return this.parseReturnStatement();
      }

      if (this.match('keyword', 'throw')) {
        return this.parseThrowStatement();
      }

      if (this.match('keyword', 'try')) {
        return this.parseTryStatement();
      }

      // Handle expression statements
      const expr = this.parseExpression();
      this.consume('semicolon', ';', "Expected ';' after expression");
      return {
        type: 'ExpressionStatement',
        expression: expr,
        loc: this.createLocation(expr.loc?.start, this.previousToken()?.loc?.end)
      };

    } catch (error) {
      if (error instanceof ParserError) {
        this.synchronize();
        return null;
      }
      throw error;
    }
  }

  // Helper methods for token handling
  private match(...types: (TokenType | string)[]): boolean {
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const nextType = types[i + 1];
      
      if (typeof nextType === 'string') {
        if (this.check(type as TokenType, nextType)) {
          return true;
        }
        i++; // Skip the next type since we've already checked it
      } else if (this.check(type as TokenType)) {
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType, value?: string): boolean {
    if (this.isAtEnd()) return false;
    const token = this.currentToken();
    return token.type === type && (value === undefined || token.value === value);
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++;
    return this.previousToken();
  }

  private isAtEnd(): boolean {
    return this.position >= this.tokens.length;
  }

  private currentToken(): Token {
    return this.tokens[this.position];
  }

  private previousToken(): Token {
    return this.tokens[this.position - 1];
  }

  private createLocation(
    start: AST.Position | null | undefined,
    end: AST.Position | null | undefined
  ): AST.SourceLocation | null {
    if (!start || !end) return null;
    return { start, end };
  }

  // Error handling
  private error(message: string, token: Token): never {
    throw new ParserError(
      message,
      token.loc?.start || { line: 0, column: 0 },
      this.source
    );
  }

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previousToken().type === 'semicolon') return;

      switch (this.currentToken().type) {
        case 'class':
        case 'function':
        case 'var':
        case 'let':
        case 'const':
        case 'for':
        case 'if':
        case 'while':
        case 'return':
          return;
      }

      this.advance();
    }
  }

  // Add stubs for all the parse methods
  private parseVariableDeclaration(): AST.VariableDeclaration {
    const start = this.currentToken().loc?.start;
    const kind = this.currentToken().value as 'let' | 'const' | 'var';
    this.advance(); // Skip 'let', 'const', or 'var'

    const id = this.parseIdentifier();
    let init: AST.Expression | null = null;

    if (this.match('operator', '=')) {
      this.advance(); // Skip '='
      init = this.parseExpression();
    }

    this.consume('semicolon', ';', "Expected ';' after variable declaration");

    return {
      type: 'VariableDeclaration',
      kind,
      id,
      init,
      loc: this.createLocation(start, this.previousToken().loc?.end)
    };
  }

  private parseIdentifier(): AST.Identifier {
    if (this.match('identifier')) {
      const token = this.currentToken();
      this.advance();
      return {
        type: 'Identifier',
        name: token.value,
        loc: token.loc || null
      };
    }
    throw this.error('Expected identifier', this.currentToken());
  }

  private parseExpression(): AST.Expression {
    // This is a simplified version - you'll need to implement the full expression parsing
    return this.parseAssignment();
  }

  private parseAssignment(): AST.Expression {
    const expr = this.parseEquality();
    
    if (this.match('operator', '=')) {
      const equals = this.previousToken();
      const value = this.parseAssignment();
      
      if (expr.type === 'Identifier') {
        return {
          type: 'AssignmentExpression',
          operator: '=',
          left: expr,
          right: value,
          loc: this.createLocation(expr.loc?.start, value.loc?.end)
        };
      }
      
      this.error('Invalid assignment target', equals);
    }
    
    return expr;
  }

  private parseEquality(): AST.Expression {
    let expr = this.parseComparison();
    
    while (this.match('operator', '==', '!=', '===', '!==')) {
      const operator = this.previousToken().value;
      const right = this.parseComparison();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        loc: this.createLocation(expr.loc?.start, right.loc?.end)
      };
    }
    
    return expr;
  }

  private parseComparison(): AST.Expression {
    let expr = this.parseTerm();
    
    while (this.match('operator', '>', '>=', '<', '<=')) {
      const operator = this.previousToken().value;
      const right = this.parseTerm();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        loc: this.createLocation(expr.loc?.start, right.loc?.end)
      };
    }
    
    return expr;
  }

  private parseTerm(): AST.Expression {
    let expr = this.parseFactor();
    
    while (this.match('operator', '+', '-')) {
      const operator = this.previousToken().value;
      const right = this.parseFactor();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        loc: this.createLocation(expr.loc?.start, right.loc?.end)
      };
    }
    
    return expr;
  }

  private parseFactor(): AST.Expression {
    let expr = this.parseUnary();
    
    while (this.match('operator', '*', '/', '%')) {
      const operator = this.previousToken().value;
      const right = this.parseUnary();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        loc: this.createLocation(expr.loc?.start, right.loc?.end)
      };
    }
    
    return expr;
  }

  private parseUnary(): AST.Expression {
    if (this.match('operator', '!', '-', '+', '~', 'typeof', 'void', 'delete')) {
      const operator = this.previousToken().value;
      const argument = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator,
        prefix: true,
        argument,
        loc: this.createLocation(
          this.previousToken().loc?.start,
          argument.loc?.end
        )
      };
    }
    
    return this.parsePrimary();
  }

  private parsePrimary(): AST.Expression {
    if (this.match('number')) {
      const token = this.previousToken();
      return {
        type: 'NumericLiteral',
        value: parseFloat(token.value),
        loc: token.loc || null
      };
    }
    
    if (this.match('string')) {
      const token = this.previousToken();
      return {
        type: 'StringLiteral',
        value: token.value.slice(1, -1), // Remove quotes
        loc: token.loc || null
      };
    }
    
    if (this.match('identifier')) {
      return this.parseIdentifier();
    }
    
    if (this.match('punctuation', '(')) {
      const expr = this.parseExpression();
      this.consume('punctuation', ')', "Expected ')' after expression");
      return expr;
    }
    
    throw this.error('Expected expression', this.currentToken());
  }

  // Add stubs for other statement types
  private parseFunctionDeclaration(): AST.FunctionDeclaration {
    throw new Error('Not implemented');
  }

  private parseClassDeclaration(): AST.ClassDeclaration {
    throw new Error('Not implemented');
  }

  private parseBlockStatement(): AST.BlockStatement {
    throw new Error('Not implemented');
  }

  private parseIfStatement(): AST.IfStatement {
    throw new Error('Not implemented');
  }

  private parseForStatement(): AST.ForStatement {
    throw new Error('Not implemented');
  }

  private parseWhileStatement(): AST.WhileStatement {
    throw new Error('Not implemented');
  }

  private parseDoWhileStatement(): AST.DoWhileStatement {
    throw new Error('Not implemented');
  }

  private parseSwitchStatement(): AST.SwitchStatement {
    throw new Error('Not implemented');
  }

  private parseReturnStatement(): AST.ReturnStatement {
    throw new Error('Not implemented');
  }

  private consume(type: TokenType, value: string, message: string): Token {
    if (this.check(type, value)) {
      return this.advance();
    }

    throw this.error(
      message,
      this.currentToken()
    );
  }

  private parseThrowStatement(): AST.ThrowStatement {
    throw new Error('Not implemented');
  }

  private parseTryStatement(): AST.TryStatement {
    throw new Error('Not implemented');
  }
}