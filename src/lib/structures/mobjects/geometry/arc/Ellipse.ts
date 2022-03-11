import type { ICircleConfig } from '../../../../typings';
import { Circle } from './Circle';

export class Ellipse extends Circle {
  constructor(
    width: number,
    height: number,
    circleConfig?: Partial<ICircleConfig>,
  ) {
    super(circleConfig?.color, circleConfig?.radius, circleConfig?.arcConfig);
  }
}
