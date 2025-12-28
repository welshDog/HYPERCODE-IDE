"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("./src/tokenizer");
var parser_1 = require("./src/parser");
function printTokens(tokens) {
    console.log('Tokens:');
    console.log(tokens.map(function (t) {
        var _a, _b;
        return ({
            type: t.type,
            value: t.value,
            line: (_a = t.loc) === null || _a === void 0 ? void 0 : _a.start.line,
            column: (_b = t.loc) === null || _b === void 0 ? void 0 : _b.start.column
        });
    }));
}
// Example 1: Simple variable declaration
var source1 = 'const answer = 42;';
console.log('\nExample 1: Simple variable declaration');
console.log('Source:', source1);
// Tokenize
var tokenizer1 = new tokenizer_1.Tokenizer(source1);
var tokens1 = tokenizer1.tokenize();
printTokens(tokens1);
// Parse
var parser1 = new parser_1.Parser(tokens1);
try {
    var ast1 = parser1.parse();
    console.log('AST:', JSON.stringify(ast1, null, 2));
}
catch (error) {
    console.error('Parse error:', error.message);
}
