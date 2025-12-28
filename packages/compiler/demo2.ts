import { Tokenizer } from './src/tokenizer';
import { Parser } from './src/parser';

function printTokens(tokens: any[]) {
  console.log('Tokens:');
  console.log(tokens.map(t => ({
    type: t.type,
    value: t.value,
    line: t.loc?.start.line,
    column: t.loc?.start.column
  })));
}

// Example 1: Simple variable declaration
const source1 = 'const answer = 42;';
console.log('\nExample 1: Simple variable declaration');
console.log('Source:', source1);

// Tokenize
const tokenizer1 = new Tokenizer(source1);
const tokens1 = tokenizer1.tokenize();
printTokens(tokens1);

// Parse
const parser1 = new Parser(tokens1, source1);
try {
  const ast1 = parser1.parse();
  console.log('AST:', JSON.stringify(ast1, null, 2));
} catch (error) {
  console.error('Parse error:', (error as Error).message);
}
