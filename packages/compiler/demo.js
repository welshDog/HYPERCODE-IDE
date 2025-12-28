"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("./src");
// Example 1: Simple variable declaration
var source1 = 'const answer = 42;';
console.log('\nExample 1: Simple variable declaration');
console.log('Source:', source1);
var ast1 = (0, src_1.compile)(source1);
console.log('AST:', JSON.stringify(ast1, null, 2));
// Example 2: Function declaration with parameters
var source2 = "\n  function add(a, b) {\n    return a + b;\n  }\n";
console.log('\nExample 2: Function declaration');
console.log('Source:', source2.trim());
var ast2 = (0, src_1.compile)(source2);
console.log('AST:', JSON.stringify(ast2, null, 2));
// Example 3: Expression with binary operation
var source3 = 'const result = (10 + 5) * 2;';
console.log('\nExample 3: Expression with binary operation');
console.log('Source:', source3);
var ast3 = (0, src_1.compile)(source3);
console.log('AST:', JSON.stringify(ast3, null, 2));
