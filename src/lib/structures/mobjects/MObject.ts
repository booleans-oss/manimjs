export class MObject {
  set_color = (color: string): MObject => this;

  set_opacity = (opacity: number): MObject => this;

  move_to = (position: string): MObject => this;

  copy = (): MObject => new MObject();

  next_to = (mobject: MObject, position: string): MObject => this;
}
