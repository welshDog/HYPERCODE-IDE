"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
var Tokenizer = /** @class */ (function () {
    function Tokenizer(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }
    Tokenizer.prototype.tokenize = function () {
        var tokens = [];
        var token;
        while ((token = this.getNextToken())) {
            tokens.push(token);
            if (token.type === 'eof')
                break;
        }
        return tokens;
    };
    Tokenizer.prototype.getNextToken = function () {
        this.skipWhitespace();
        if (this.position >= this.input.length) {
            return this.createToken('eof', '');
        }
        var char = this.input[this.position];
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
    };
    Tokenizer.prototype.readNumber = function () {
        var value = '';
        var hasDecimal = false;
        var start = this.currentPosition();
        while (this.position < this.input.length) {
            var char = this.input[this.position];
            if (this.isDigit(char)) {
                value += char;
                this.advance();
            }
            else if (char === '.' && !hasDecimal) {
                value += char;
                hasDecimal = true;
                this.advance();
            }
            else {
                break;
            }
        }
        return this.createToken('number', value, start);
    };
    Tokenizer.prototype.readString = function () {
        var quote = this.input[this.position];
        var value = '';
        var start = this.currentPosition();
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
    };
    Tokenizer.prototype.readIdentifier = function () {
        var value = '';
        var start = this.currentPosition();
        while (this.position < this.input.length && this.isIdentifierPart(this.input[this.position])) {
            value += this.input[this.position];
            this.advance();
        }
        var type = this.isKeyword(value) ? 'keyword' : 'identifier';
        return this.createToken(type, value, start);
    };
    Tokenizer.prototype.readOperator = function () {
        var value = '';
        var start = this.currentPosition();
        while (this.position < this.input.length && this.isOperator(this.input[this.position])) {
            value += this.input[this.position];
            this.advance();
        }
        return this.createToken('operator', value, start);
    };
    Tokenizer.prototype.readPunctuation = function () {
        var char = this.input[this.position];
        var start = this.currentPosition();
        this.advance();
        return this.createToken('punctuation', char, start);
    };
    Tokenizer.prototype.skipWhitespace = function () {
        while (this.position < this.input.length && this.isWhitespace(this.input[this.position])) {
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 1;
            }
            else {
                this.column++;
            }
            this.position++;
        }
    };
    Tokenizer.prototype.skipLineComment = function () {
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
            this.advance();
        }
        this.advance(); // Skip the newline
    };
    Tokenizer.prototype.skipBlockComment = function () {
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
    };
    Tokenizer.prototype.advance = function () {
        if (this.input[this.position] === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        this.position++;
    };
    Tokenizer.prototype.createToken = function (type, value, start, end) {
        if (start === void 0) { start = this.currentPosition(); }
        if (end === void 0) { end = { line: this.line, column: this.column }; }
        return {
            type: type,
            value: value,
            loc: { start: start, end: end }
        };
    };
    Tokenizer.prototype.currentPosition = function () {
        return { line: this.line, column: this.column };
    };
    Tokenizer.prototype.isDigit = function (char) {
        return /[0-9]/.test(char);
    };
    Tokenizer.prototype.isIdentifierStart = function (char) {
        return /[a-zA-Z_$]/.test(char);
    };
    Tokenizer.prototype.isIdentifierPart = function (char) {
        return /[a-zA-Z0-9_$]/.test(char);
    };
    Tokenizer.prototype.isOperator = function (char) {
        return /[+\-*/%&|<>=!?]/.test(char);
    };
    Tokenizer.prototype.isPunctuation = function (char) {
        return /[(){}\[\],;:.]/.test(char);
    };
    Tokenizer.prototype.isWhitespace = function (char) {
        return /[\s\t\n\r]/.test(char);
    };
    Tokenizer.prototype.isKeyword = function (word) {
        var keywords = [
            'function', 'let', 'const', 'var', 'if', 'else', 'return',
            'for', 'while', 'do', 'break', 'continue', 'true', 'false',
            'null', 'undefined', 'this', 'new', 'class', 'extends', 'super',
            'import', 'export', 'default', 'as', 'from', 'type', 'interface'
        ];
        return keywords.includes(word);
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
