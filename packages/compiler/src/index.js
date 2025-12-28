"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Tokenizer = void 0;
exports.compile = compile;
var tokenizer_1 = require("./tokenizer");
Object.defineProperty(exports, "Tokenizer", { enumerable: true, get: function () { return tokenizer_1.Tokenizer; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parser_1.Parser; } });
function compile(source) {
    var tokenizer = new tokenizer_1.Tokenizer(source);
    var tokens = tokenizer.tokenize();
    var parser = new parser_1.Parser(tokens);
    return parser.parse();
}
