export interface ICircleConfig {
  color?: string;
  radius?: number;
  arcConfig?: IArcConfig;
}

export interface IArcConfig {
  angle?: number;
  width?: number;
  start_angle?: number;
  radius?: number;
  fill_opacity?: number;
  stroke_width?: number;
  num_components?: number;
  arc_center?: number[];
}

export interface ITextConfig {
  fill_opacity?: number;
  stroke_width?: number;
  color?: string;
  font_size?: number;
  line_spacing?: number;
  font?: string;
  slant?: 'NORMAL';
  weight?: 'NORMAL';
  justify?: boolean;
  gradient?: string;
  tab_width: number;
  height?: number;
  width?: number;
  should_center?: boolean;
  unpack_groups?: boolean;
  disable_ligatures?: boolean;
}
