export type NodeType = 'Program' | 'NumericLiteral' | 'StringLiteral' | 'Identifier' | 'BinaryExpression' | 'CallExpression' | 'FunctionDeclaration' | 'VariableDeclaration';
export interface Node {
    type: NodeType;
    loc: SourceLocation | null;
}
export interface SourceLocation {
    start: Position;
    end: Position;
    source?: string;
}
export interface Position {
    line: number;
    column: number;
}
export interface Program extends Node {
    type: 'Program';
    body: Statement[];
}
export type Statement = Expression | VariableDeclaration | FunctionDeclaration;
export type Expression = NumericLiteral | StringLiteral | Identifier | BinaryExpression | CallExpression;
export interface NumericLiteral extends Node {
    type: 'NumericLiteral';
    value: number;
}
export interface StringLiteral extends Node {
    type: 'StringLiteral';
    value: string;
}
export interface Identifier extends Node {
    type: 'Identifier';
    name: string;
}
export interface BinaryExpression extends Node {
    type: 'BinaryExpression';
    operator: string;
    left: Expression;
    right: Expression;
}
export interface CallExpression extends Node {
    type: 'CallExpression';
    callee: Expression;
    arguments: Expression[];
}
export interface VariableDeclaration extends Node {
    type: 'VariableDeclaration';
    id: Identifier;
    init: Expression | null;
}
export interface FunctionDeclaration extends Node {
    type: 'FunctionDeclaration';
    name: Identifier;
    params: Identifier[];
    body: Statement[];
}
//# sourceMappingURL=ast.d.ts.map