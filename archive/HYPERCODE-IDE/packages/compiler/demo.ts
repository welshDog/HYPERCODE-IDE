import { compile } from './src';

// Example 1: Simple variable declaration
const source1 = 'const answer = 42;';
console.log('\nExample 1: Simple variable declaration');
console.log('Source:', source1);
const ast1 = compile(source1);
console.log('AST:', JSON.stringify(ast1, null, 2));

// Example 2: Function declaration with parameters
const source2 = `
  function add(a, b) {
    return a + b;
  }
`;
console.log('\nExample 2: Function declaration');
console.log('Source:', source2.trim());
const ast2 = compile(source2);
console.log('AST:', JSON.stringify(ast2, null, 2));

// Example 3: Expression with binary operation
const source3 = 'const result = (10 + 5) * 2;';
console.log('\nExample 3: Expression with binary operation');
console.log('Source:', source3);
const ast3 = compile(source3);
console.log('AST:', JSON.stringify(ast3, null, 2));
