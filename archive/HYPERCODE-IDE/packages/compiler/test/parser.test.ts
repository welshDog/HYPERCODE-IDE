import { Parser } from '../src/parser';
import { Tokenizer } from '../src/tokenizer';
import * as AST from '../../core/src';

describe('Parser', () => {
  function parse(source: string): AST.Program {
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    return parser.parse();
  }

  it('should parse number literals', () => {
    const ast = parse('42;');
    expect(ast.body[0]).toMatchObject({
      type: 'NumericLiteral',
      value: 42
    });
  });

  it('should parse string literals', () => {
    const ast = parse('"hello";');
    expect(ast.body[0]).toMatchObject({
      type: 'StringLiteral',
      value: 'hello'
    });
  });

  it('should parse variable declarations', () => {
    const ast = parse('let x = 42;');
    expect(ast.body[0]).toMatchObject({
      type: 'VariableDeclaration',
      id: { type: 'Identifier', name: 'x' },
      init: { type: 'NumericLiteral', value: 42 }
    });
  });

  it('should parse function declarations', () => {
    const ast = parse('function add(a, b) { return a + b; }');
    expect(ast.body[0]).toMatchObject({
      type: 'FunctionDeclaration',
      name: { type: 'Identifier', name: 'add' },
      params: [
        { type: 'Identifier', name: 'a' },
        { type: 'Identifier', name: 'b' }
      ]
    });
  });
});