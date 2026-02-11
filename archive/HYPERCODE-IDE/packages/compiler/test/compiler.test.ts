import { compile } from '../src';
import * as AST from '@hypercode/core';

describe('Compiler', () => {
  it('should compile a simple expression', () => {
    const source = 'const answer = 42;';
    const ast = compile(source);
    
    expect(ast.type).toBe('Program');
    expect(ast.body).toHaveLength(1);
    
    const decl = ast.body[0] as AST.VariableDeclaration;
    expect(decl.type).toBe('VariableDeclaration');
    expect(decl.id.name).toBe('answer');
    
    const literal = decl.init as AST.NumericLiteral;
    expect(literal.type).toBe('NumericLiteral');
    expect(literal.value).toBe(42);
  });

  it('should compile a function declaration', () => {
    const source = `
      function add(a, b) {
        return a + b;
      }
    `;
    
    const ast = compile(source);
    expect(ast.type).toBe('Program');
    expect(ast.body).toHaveLength(1);
    
    const func = ast.body[0] as AST.FunctionDeclaration;
    expect(func.type).toBe('FunctionDeclaration');
    expect(func.name.name).toBe('add');
    expect(func.params).toHaveLength(2);
    expect(func.params[0].name).toBe('a');
    expect(func.params[1].name).toBe('b');
    expect(func.body).toHaveLength(1);
  });
});
