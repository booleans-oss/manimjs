import type { IArcConfig } from '../../../../typings';
import { Arc } from './Arc';

export class Circle extends Arc {
  constructor(color?: string, radius?: number, arcConfig?: IArcConfig) {
    super(
      arcConfig?.angle,
      arcConfig?.width,
      arcConfig?.start_angle,
      radius,
      arcConfig?.fill_opacity,
      arcConfig?.stroke_width,
      arcConfig?.num_components,
      arcConfig?.arc_center,
    );
  }
}
