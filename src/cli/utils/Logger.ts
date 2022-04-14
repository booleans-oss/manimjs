import { Logger as TSLogger } from 'tslog';

export class Logger extends TSLogger {
  constructor() {
    super({ name: 'Logger' });
  }
}
