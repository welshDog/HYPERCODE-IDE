"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var Parser = /** @class */ (function () {
    function Parser(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }
    Parser.prototype.parse = function () {
        var program = {
            type: 'Program',
            body: [],
            loc: this.createLocation({ line: 1, column: 1 }, { line: 1, column: 1 })
        };
        while (!this.isAtEnd()) {
            var stmt = this.parseStatement();
            if (stmt) {
                program.body.push(stmt);
            }
        }
        return program;
    };
    Parser.prototype.parseStatement = function () {
        if (this.match('keyword', 'let') || this.match('keyword', 'const')) {
            return this.parseVariableDeclaration();
        }
        if (this.match('keyword', 'function')) {
            return this.parseFunctionDeclaration();
        }
        return this.parseExpression();
    };
    Parser.prototype.parseVariableDeclaration = function () {
        var _a, _b;
        var start = (_a = this.currentToken().loc) === null || _a === void 0 ? void 0 : _a.start;
        this.advance(); // Skip 'let' or 'const'
        var id = this.parseIdentifier();
        var init = null;
        if (this.match('operator', '=')) {
            this.advance(); // Skip '='
            init = this.parseExpression();
        }
        this.consume('punctuation', ';', "Expect ';' after variable declaration");
        return {
            type: 'VariableDeclaration',
            id: id,
            init: init,
            loc: this.createLocation(start, (_b = this.previousToken().loc) === null || _b === void 0 ? void 0 : _b.end)
        };
    };
    Parser.prototype.parseFunctionDeclaration = function () {
        var _a, _b;
        var start = (_a = this.currentToken().loc) === null || _a === void 0 ? void 0 : _a.start;
        this.advance(); // Skip 'function'
        var name = this.parseIdentifier();
        this.consume('punctuation', '(', "Expect '(' after function name");
        var params = [];
        if (!this.check('punctuation', ')')) {
            do {
                if (params.length >= 255) {
                    throw new Error("Can't have more than 255 parameters");
                }
                params.push(this.parseIdentifier());
            } while (this.match('punctuation', ','));
        }
        this.consume('punctuation', ')', "Expect ')' after parameters");
        this.consume('punctuation', '{', "Expect '{' before function body");
        var body = [];
        while (!this.check('punctuation', '}') && !this.isAtEnd()) {
            var stmt = this.parseStatement();
            if (stmt) {
                body.push(stmt);
            }
        }
        this.consume('punctuation', '}', "Expect '}' after function body");
        return {
            type: 'FunctionDeclaration',
            name: name,
            params: params,
            body: body,
            loc: this.createLocation(start, (_b = this.previousToken().loc) === null || _b === void 0 ? void 0 : _b.end)
        };
    };
    Parser.prototype.parseExpression = function () {
        return this.parseAssignment();
    };
    Parser.prototype.parseAssignment = function () {
        var _a, _b;
        var expr = this.parseEquality();
        if (this.match('operator', '=')) {
            var equals = this.previousToken();
            var value = this.parseAssignment();
            if (expr.type === 'Identifier') {
                return {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: expr,
                    right: value,
                    loc: this.createLocation((_a = expr.loc) === null || _a === void 0 ? void 0 : _a.start, (_b = value.loc) === null || _b === void 0 ? void 0 : _b.end)
                }; // We'll need to add AssignmentExpression to our AST types
            }
            throw new Error('Invalid assignment target');
        }
        return expr;
    };
    Parser.prototype.parseEquality = function () {
        var expr = this.parseComparison();
        while (this.match('operator', '==', '!=', '===', '!==')) {
            var operator = this.previousToken().value;
            var right = this.parseComparison();
            expr = this.createBinaryExpression(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.parseComparison = function () {
        var expr = this.parseTerm();
        while (this.match('operator', '>', '>=', '<', '<=')) {
            var operator = this.previousToken().value;
            var right = this.parseTerm();
            expr = this.createBinaryExpression(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.parseTerm = function () {
        var expr = this.parseFactor();
        while (this.match('operator', '+', '-')) {
            var operator = this.previousToken().value;
            var right = this.parseFactor();
            expr = this.createBinaryExpression(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.parseFactor = function () {
        var expr = this.parseUnary();
        while (this.match('operator', '*', '/', '%')) {
            var operator = this.previousToken().value;
            var right = this.parseUnary();
            expr = this.createBinaryExpression(expr, operator, right);
        }
        return expr;
    };
    Parser.prototype.parseUnary = function () {
        var _a, _b;
        if (this.match('operator', '!', '-')) {
            var operator = this.previousToken().value;
            var right = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator: operator,
                argument: right,
                loc: this.createLocation((_a = this.previousToken().loc) === null || _a === void 0 ? void 0 : _a.start, (_b = right.loc) === null || _b === void 0 ? void 0 : _b.end)
            }; // We'll need to add UnaryExpression to our AST types
        }
        return this.parsePrimary();
    };
    Parser.prototype.parsePrimary = function () {
        if (this.match('number')) {
            return {
                type: 'NumericLiteral',
                value: parseFloat(this.previousToken().value),
                loc: this.previousToken().loc
            };
        }
        if (this.match('string')) {
            return {
                type: 'StringLiteral',
                value: this.previousToken().value,
                loc: this.previousToken().loc
            };
        }
        if (this.match('identifier')) {
            return this.parseIdentifier();
        }
        if (this.match('punctuation', '(')) {
            var expr = this.parseExpression();
            this.consume('punctuation', ')', "Expect ')' after expression");
            return expr;
        }
        throw new Error('Unexpected token: ' + this.currentToken().value);
    };
    Parser.prototype.parseIdentifier = function () {
        if (this.check('identifier')) {
            var token = this.advance();
            return {
                type: 'Identifier',
                name: token.value,
                loc: token.loc
            };
        }
        throw new Error('Expected identifier');
    };
    Parser.prototype.createBinaryExpression = function (left, operator, right) {
        var _a, _b;
        return {
            type: 'BinaryExpression',
            operator: operator,
            left: left,
            right: right,
            loc: this.createLocation((_a = left.loc) === null || _a === void 0 ? void 0 : _a.start, (_b = right.loc) === null || _b === void 0 ? void 0 : _b.end)
        };
    };
    Parser.prototype.match = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var i = 0; i < types.length; i++) {
            if (this.check(types[i], types[i + 1])) {
                this.advance();
                return true;
            }
        }
        return false;
    };
    Parser.prototype.check = function (type, value) {
        if (this.isAtEnd())
            return false;
        var token = this.currentToken();
        return token.type === type && (value === undefined || token.value === value);
    };
    Parser.prototype.consume = function (type, value, message) {
        if (this.check(type, value))
            return this.advance();
        throw new Error(message);
    };
    Parser.prototype.advance = function () {
        if (!this.isAtEnd())
            this.position++;
        return this.previousToken();
    };
    Parser.prototype.isAtEnd = function () {
        return this.currentToken().type === 'eof';
    };
    Parser.prototype.currentToken = function () {
        return this.tokens[this.position] || { type: 'eof', value: '', loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } } };
    };
    Parser.prototype.previousToken = function () {
        return this.tokens[this.position - 1] || { type: 'eof', value: '', loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } } };
    };
    Parser.prototype.createLocation = function (start, end) {
        if (!start || !end)
            return null;
        return { start: start, end: end };
    };
    return Parser;
}());
exports.Parser = Parser;
