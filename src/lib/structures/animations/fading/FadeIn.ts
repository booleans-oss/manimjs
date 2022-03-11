import type { MObject } from '../../mobjects/MObject';
import { Animation } from '../Animation';

export class FadeIn extends Animation {
  constructor(...mobject: MObject[]) {
    super(...mobject);
  }
}
