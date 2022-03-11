import type { ITextConfig } from '../../../../typings';
import { MObject } from '../../MObject';

export class MarkupText extends MObject {
  constructor(text: string, config: ITextConfig) {
    super();
  }
}
