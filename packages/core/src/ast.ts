export type NodeType = 
  | 'Program'
  | 'NumericLiteral'
  | 'StringLiteral'
  | 'BooleanLiteral'
  | 'NullLiteral'
  | 'Identifier'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'AssignmentExpression'
  | 'CallExpression'
  | 'MemberExpression'
  | 'FunctionDeclaration'
  | 'FunctionExpression'
  | 'ArrowFunctionExpression'
  | 'VariableDeclaration'
  | 'VariableDeclarator'
  | 'ExpressionStatement'
  | 'BlockStatement'
  | 'IfStatement'
  | 'ForStatement'
  | 'WhileStatement'
  | 'DoWhileStatement'
  | 'SwitchStatement'
  | 'SwitchCase'
  | 'ReturnStatement'
  | 'ThrowStatement'
  | 'TryStatement'
  | 'CatchClause'
  | 'ClassDeclaration'
  | 'ClassBody'
  | 'MethodDefinition'
  | 'ClassProperty'
  | 'ArrayExpression'
  | 'ObjectExpression'
  | 'ObjectPattern'
  | 'ArrayPattern'
  | 'Property'
  | 'ThisExpression'
  | 'NewExpression'
  | 'UpdateExpression';

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

export type Statement = 
  | ExpressionStatement
  | VariableDeclaration
  | FunctionDeclaration
  | ClassDeclaration
  | BlockStatement
  | IfStatement
  | ForStatement
  | WhileStatement
  | DoWhileStatement
  | SwitchStatement
  | ReturnStatement
  | ThrowStatement
  | TryStatement;

export type Expression = 
  | NumericLiteral 
  | StringLiteral 
  | BooleanLiteral
  | NullLiteral
  | Identifier 
  | BinaryExpression 
  | UnaryExpression
  | AssignmentExpression
  | CallExpression
  | MemberExpression
  | ArrayExpression
  | ObjectExpression
  | ThisExpression
  | NewExpression
  | UpdateExpression;
//  | 'FunctionExpression' // FunctionExpression and ArrowFunctionExpression are already Nodes, not just string literals
//  | 'ArrowFunctionExpression';

export interface ExpressionStatement extends Node {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface BlockStatement extends Node {
  type: 'BlockStatement';
  body: Statement[];
}

export interface IfStatement extends Node {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate?: Statement;
}

export interface ForStatement extends Node {
  type: 'ForStatement';
  init?: VariableDeclaration | Expression;
  test?: Expression;
  update?: Expression;
  body: Statement;
}

export interface WhileStatement extends Node {
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
}

export interface DoWhileStatement extends Node {
  type: 'DoWhileStatement';
  test: Expression;
  body: Statement;
}

export interface SwitchStatement extends Node {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface SwitchCase {
  type: 'SwitchCase';
  test?: Expression;
  consequent: Statement[];
}

export interface ReturnStatement extends Node {
  type: 'ReturnStatement';
  argument?: Expression;
}

export interface ThrowStatement extends Node {
  type: 'ThrowStatement';
  argument: Expression;
}

export interface TryStatement extends Node {
  type: 'TryStatement';
  block: BlockStatement;
  handler?: CatchClause;
  finalizer?: BlockStatement;
}

export interface CatchClause {
  type: 'CatchClause';
  param: Identifier;
  body: BlockStatement;
}

export interface NumericLiteral extends Node {
  type: 'NumericLiteral';
  value: number;
}

export interface StringLiteral extends Node {
  type: 'StringLiteral';
  value: string;
}

export interface BooleanLiteral extends Node {
  type: 'BooleanLiteral';
  value: boolean;
}

export interface NullLiteral extends Node {
  type: 'NullLiteral';
  value: null;
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

export interface UnaryExpression extends Node {
  type: 'UnaryExpression';
  operator: string;
  prefix: boolean;
  argument: Expression;
}

export interface AssignmentExpression extends Node {
  type: 'AssignmentExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface CallExpression extends Node {
  type: 'CallExpression';
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression extends Node {
  type: 'MemberExpression';
  object: Expression;
  property: Expression;
  computed: boolean;
}

export interface FunctionExpression extends Node {
  type: 'FunctionExpression';
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  expression: boolean;
}

export interface ArrowFunctionExpression extends Node {
  type: 'ArrowFunctionExpression';
  id: Identifier | null;
  params: Pattern[];
  body: BlockStatement | Expression; // Can be a block or a single expression
  generator: boolean;
  async: boolean;
  expression: boolean;
}

export interface FunctionDeclaration extends Node {
  type: 'FunctionDeclaration';
  id: Identifier;
  params: Pattern[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  expression: boolean;
}

export interface VariableDeclaration extends Node {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'var' | 'let' | 'const';
}

export interface VariableDeclarator extends Node {
  type: 'VariableDeclarator';
  id: Pattern;
  init: Expression | null;
}

export type Pattern = Identifier | ObjectPattern | ArrayPattern;

export interface ObjectPattern extends Node {
  type: 'ObjectPattern';
  properties: Property[];
}

export interface ArrayPattern extends Node {
  type: 'ArrayPattern';
  elements: (Pattern | null)[];
}

export interface Property extends Node {
  type: 'Property';
  key: Expression;
  value: Pattern | Expression;
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

export interface ArrayExpression extends Node {
  type: 'ArrayExpression';
  elements: (Expression | null)[];
}

export interface ObjectExpression extends Node {
  type: 'ObjectExpression';
  properties: Property[];
}

export interface ThisExpression extends Node {
  type: 'ThisExpression';
}

export interface NewExpression extends Node {
  type: 'NewExpression';
  callee: Expression;
  arguments: Expression[];
}

export interface UpdateExpression extends Node {
  type: 'UpdateExpression';
  operator: '++' | '--';
  argument: Expression;
  prefix: boolean;
}

export interface ClassDeclaration extends Node {
  type: 'ClassDeclaration';
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
}
export interface ClassBody {
  type: 'ClassBody';
  body: ClassElement[];
}

export type ClassElement = MethodDefinition | ClassProperty;

export interface MethodDefinition extends Node {
  type: 'MethodDefinition';
  key: Expression;
  value: FunctionExpression;
  kind: 'constructor' | 'method' | 'get' | 'set';
  static: boolean;
  computed: boolean;
}

export interface ClassProperty extends Node {
  type: 'ClassProperty';
  key: Expression;
  value: Expression | null;
  computed: boolean;
  static: boolean;
}