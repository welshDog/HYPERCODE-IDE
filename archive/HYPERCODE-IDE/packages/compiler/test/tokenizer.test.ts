import { Tokenizer } from '../src/tokenizer';

describe('Tokenizer', () => {
  it('should tokenize numbers', () => {
    const tokenizer = new Tokenizer('123 45.67');
    const tokens = tokenizer.tokenize();
    expect(tokens.map(t => t.value)).toEqual(['123', '45.67', '']);
  });

  it('should tokenize strings', () => {
    const tokenizer = new Tokenizer('"hello" \'world\'');
    const tokens = tokenizer.tokenize();
    expect(tokens.map(t => t.value)).toEqual(['hello', 'world', '']);
  });

  it('should tokenize identifiers and keywords', () => {
    const tokenizer = new Tokenizer('let x = 42');
    const tokens = tokenizer.tokenize();
    expect(tokens.map(t => t.type)).toEqual(['keyword', 'identifier', 'operator', 'number', 'eof']);
  });

  it('should handle operators', () => {
    const tokenizer = new Tokenizer('x + y * z');
    const tokens = tokenizer.tokenize();
    expect(tokens.map(t => t.type)).toEqual(['identifier', 'operator', 'identifier', 'operator', 'identifier', 'eof']);
  });
});