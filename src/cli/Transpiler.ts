import { writeFileSync } from 'fs';
import path from 'path';
import { parse } from 'recast';

import type { Logger } from './utils/Logger';

export class Transpiler {
  ctx = '';

  constructor(private readonly logger: Logger) {}

  parseContent(content: string): string {
    return content
      .split('\n')
      .filter((line) => !line.includes('require') && !line.includes('import'))
      .join('\n')
      .trim();
  }

  parseFile(rawContent: string) {
    const content = this.parseContent(rawContent);
    const { program } = parse(content);
    this.ctx += 'from manim import * \n \n';
    this.parseBody(program as Script);
  }

  build(filePath: string) {
    writeFileSync(
      path.join(process.cwd(), `${filePath.split('.')[0]}.py`),
      this.ctx,
    );
  }

  parseBody(program: Script | ClassBody | BlockStatement) {
    if (!program || !program.body) {
      return this.ctx;
    }

    for (let i = 0; i < program.body.length; i++) {
      const token = program.body[i];

      if (token.loc.start.line > program.body[i - 1]?.loc.end.line) {
        this.ctx += '\n';
        this.ctx += Array.from({ length: token.loc.indent }).join(' ');
      }

      switch (token.type) {
        case 'ClassDeclaration': {
          const name = token.id.name;
          const classToken = token as ClassDeclaration;
          this.ctx += `class ${name}(${classToken.superClass.name}): \n`;
          this.parseBody(classToken.body);
          break;
        }

        case 'MethodDefinition': {
          this.ctx += Array.from({ length: token.loc.indent }).join(' ');
          const methodToken = token as MethodDeclaration;
          const name = methodToken.key.name;
          this.ctx += `def ${
            methodToken.kind === 'constructor' ? 'construct' : name
          }(${
            token.kind === 'constructor'
              ? 'self'
              : methodToken.value.params.join(',')
          }):`;
          this.parseBody(methodToken.value.body);
          break;
        }

        case 'ExpressionStatement': {
          this.parseExpressionStatement(token);
          break;
        }

        case 'VariableDeclaration': {
          this.parseVariableDeclaration(token as VariableDeclaration);
          break;
        }
      }
    }
  }

  parseExpressionStatement(expression: ExpressionStatement) {
    if (expression.expression.callee.type !== 'Super') {
      const exp = expression.expression.callee as StaticMemberExpression;

      const name =
        exp.object.type === 'ThisExpression'
          ? 'self'
          : (exp.object as Identifier).name;
      this.ctx += `${name}.${exp.property.name}(${this.parseArguments(
        expression.expression.arguments,
      )})`;
    }
  }

  parseVariableDeclaration(variableDeclaration: VariableDeclaration) {
    for (let i = 0; i < variableDeclaration.declarations.length; i++) {
      this.parseDeclaration(variableDeclaration.declarations[i]);
    }
  }

  parseExpression(
    expression: NewExpression | CallExpression | Identifier | ThisExpression,
  ) {
    switch (expression.type) {
      case 'CallExpression': {
        this.parseExpression(
          (expression.callee as StaticMemberExpression).object,
        );
        const args = this.parseArguments(expression.arguments);
        this.ctx += `.${
          (expression.callee as StaticMemberExpression).property.name
        }(${args})`;

        break;
      }

      case 'NewExpression': {
        const args = this.parseArguments(expression.arguments);
        this.ctx += `${expression.callee.name}(${args})`;

        break;
      }

      case 'Identifier': {
        this.ctx += expression.name;

        break;
      }
      // No default
    }
  }

  parseDeclaration(declaration: Declaration) {
    const initialObj = declaration.init.callee as StaticMemberExpression;
    this.ctx += `${declaration.id.name} = `;
    this.parseExpression(initialObj.object);
    this.ctx += `.${initialObj.property.name}(${this.parseArguments(
      declaration.init.arguments,
    )})`;
  }

  parseArguments(args: Array<Argument | Value | CallExpression>) {
    const parsed: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.type === 'Identifier') {
        parsed.push(arg.name as string);
      }

      if (arg.type === 'ObjectExpression') {
        parsed.push(this.parseProperties(arg.properties).join(', '));
      }

      if (arg.type === 'BinaryExpression') {
        const left = this.parseArguments([arg.left as Value]);
        const right = this.parseArguments([arg.right as Value]);

        parsed.push(`${left} ${arg.operator} ${right}`);
      }

      if (arg.type === 'Literal') {
        parsed.push(arg.raw);
      }

      if (arg.type === 'CallExpression') {
        parsed.push(
          `${(arg.callee as Identifier).name}(${this.parseArguments(
            arg.arguments,
          )})`,
        );
      }
    }

    return parsed.join(', ');
  }

  parseProperties(properties: Property[]) {
    const parsed: string[] = [];

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      parsed.push(
        property.type === 'Property'
          ? `${property.key.name}=${
              property.value.type === 'Identifier'
                ? property.value.name
                : property.value.value
            }`
          : property.value.raw,
      );
    }

    return parsed;
  }
}

interface Identifier {
  type: 'Identifier';
  name: string;
}

interface Declaration {
  type: 'VariableDeclaration' | 'ClassDeclaration';
  id: Identifier;
  init: CallExpression;
  loc: Location;
}

interface StaticMemberExpression {
  type: 'MemberExpression';
  computed: FontFaceSetLoadEvent;
  object: NewExpression | CallExpression | Identifier | ThisExpression;
  property: Identifier;
}

interface NewExpression {
  type: 'NewExpression';
  callee: Identifier;
  arguments: ObjectExpression[];
}

interface MethodDeclaration {
  type: 'MethodDefinition';
  declarations: Declaration[];
  kind: 'constructor' | 'function';
  loc: Location;
  value: FunctionExpression;
  key: Identifier;
}

interface VariableDeclaration {
  type: 'VariableDeclaration' | 'MethodDefinition';
  declarations: Declaration[];
  kind: 'var' | 'let' | 'const';
  loc: Location;
}

interface CallExpression {
  type: 'CallExpression';
  callee: StaticMemberExpression | Super | Identifier;
  property: Identifier;
  arguments: Argument[];
  loc: Location;
}

interface Super {
  type: 'Super';
  computed: FontFaceSetLoadEvent;
  object: NewExpression | CallExpression | Identifier;
  property: Identifier;
}

interface ExpressionStatement {
  name?: string;
  type: 'ExpressionStatement';
  expression: CallExpression | NewExpression;
  arguments: Argument[];
  callee: Identifier;
  property?: Identifier;
  loc: Location;
}

interface ObjectExpression {
  type: 'ObjectExpression';
  properties: Property[];
}

interface Argument {
  name?: string;
  type: 'Identifier' | 'ObjectExpression' | 'BinaryExpression';
  properties: Property[];
  left?: Value;
  right?: Value;
  operator?: string;
}

interface Property {
  type: 'Property';
  key: Identifier;
  value: Value;
}

interface Value {
  type: 'Literal' | 'String' | 'Identifier';
  value: number | string | boolean;
  name?: string;
  raw: string;
}

interface FunctionExpression {
  type: 'FunctionExpression';
  params: string[];
  id: null;
  body: BlockStatement;
  generator: boolean;
  expression: boolean;
  kind: 'get' | 'set' | 'method' | 'constructor' | 'function';
  loc: Location;
}

interface ClassDeclaration {
  type: 'ClassDeclaration';
  id: Identifier;
  superClass: Identifier;
  body: ClassBody;
  loc: Location;
}

interface ThisExpression {
  type: 'ThisExpression';
}

interface Script {
  type: 'Program';
  body: ClassDeclaration[];
  sourceType: 'script';
  loc: Location;
}

interface ClassBody {
  type: 'ClassBody';
  body: Declaration[];
  loc: Location;
}

interface Location {
  start: Position;
  end: Position;
  indent: number;
}

interface Position {
  line: number;
  column: number;
  token: number;
}

interface BlockStatement {
  type: 'BlockStatement';
  body: Array<ExpressionStatement | VariableDeclaration | MethodDeclaration>;
  loc: Location;
}
