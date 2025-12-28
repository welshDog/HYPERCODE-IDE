"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
class Tokenizer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }
    tokenize() {
        const tokens = [];
        let token;
        while ((token = this.getNextToken())) {
            tokens.push(token);
            if (token.type === 'eof')
                break;
        }
        return tokens;
    }
    getNextToken() {
        this.skipWhitespace();
        if (this.position >= this.input.length) {
            return this.createToken('eof', '');
        }
        const char = this.input[this.position];
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
    }
    readNumber() {
        let value = '';
        let hasDecimal = false;
        const start = this.currentPosition();
        while (this.position < this.input.length) {
            const char = this.input[this.position];
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
    }
    readString() {
        const quote = this.input[this.position];
        let value = '';
        const start = this.currentPosition();
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
    }
    readIdentifier() {
        let value = '';
        const start = this.currentPosition();
        while (this.position < this.input.length && this.isIdentifierPart(this.input[this.position])) {
            value += this.input[this.position];
            this.advance();
        }
        const type = this.isKeyword(value) ? 'keyword' : 'identifier';
        return this.createToken(type, value, start);
    }
    readOperator() {
        let value = '';
        const start = this.currentPosition();
        while (this.position < this.input.length && this.isOperator(this.input[this.position])) {
            value += this.input[this.position];
            this.advance();
        }
        return this.createToken('operator', value, start);
    }
    readPunctuation() {
        const char = this.input[this.position];
        const start = this.currentPosition();
        this.advance();
        return this.createToken('punctuation', char, start);
    }
    skipWhitespace() {
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
    }
    skipLineComment() {
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
            this.advance();
        }
        this.advance(); // Skip the newline
    }
    skipBlockComment() {
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
    }
    advance() {
        if (this.input[this.position] === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        this.position++;
    }
    createToken(type, value, start = this.currentPosition(), end = { line: this.line, column: this.column }) {
        return {
            type,
            value,
            loc: { start, end }
        };
    }
    currentPosition() {
        return { line: this.line, column: this.column };
    }
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    isIdentifierStart(char) {
        return /[a-zA-Z_$]/.test(char);
    }
    isIdentifierPart(char) {
        return /[a-zA-Z0-9_$]/.test(char);
    }
    isOperator(char) {
        return /[+\-*/%&|<>=!?]/.test(char);
    }
    isPunctuation(char) {
        return /[(){}\[\],;:.]/.test(char);
    }
    isWhitespace(char) {
        return /[\s\t\n\r]/.test(char);
    }
    isKeyword(word) {
        const keywords = [
            'function', 'let', 'const', 'var', 'if', 'else', 'return',
            'for', 'while', 'do', 'break', 'continue', 'true', 'false',
            'null', 'undefined', 'this', 'new', 'class', 'extends', 'super',
            'import', 'export', 'default', 'as', 'from', 'type', 'interface'
        ];
        return keywords.includes(word);
    }
}
exports.Tokenizer = Tokenizer;
