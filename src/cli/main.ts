#!/usr/bin/env node
import * as fs from 'fs';
import path from 'path';

import { Transpiler } from './Transpiler';
import { Logger } from './utils/Logger';

class Main {
  constructor(private readonly logger: Logger) {
    const [filePath, sceneName, ...args] = process.argv.slice(2);

    if (!filePath || !sceneName) {
      throw new Error('Invalid arguments: no file path or scene name');
    }

    this.runFile(filePath, sceneName, ...args);
  }

  runFile(filePath: string, sceneName: string, ...args: string[]) {
    let content: string | undefined;

    try {
      content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    } catch (error) {
      if (error) {
        this.logger.fatal(error.message as string);
        process.exit(66);
      }
    }

    if (!content) {
      return this.logger.error('No content');
    }

    const transpiler = new Transpiler(this.logger);
    transpiler.parseFile(content);
    transpiler.build(filePath);
  }
}

new Main(new Logger());
