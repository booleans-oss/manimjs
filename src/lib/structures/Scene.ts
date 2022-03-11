import type { Animation } from './animations/Animation';
import type { MObject } from './mobjects';

export class Scene {
  add = (...objects: MObject[]): Scene => this;

  add_foreground_mobject = (mObject: MObject): Scene => this;

  add_foreground_mobjects = (...mObject: MObject[]): Scene => this;

  add_sound = (path: string, time_offset?: number, gain?: number): Scene =>
    this;

  add_subcaption = (
    content: string,
    duration?: number,
    offset?: number,
  ): void => undefined;

  begin_animation = (): void => undefined;

  bring_to_back = (...mObjects: MObject[]): Scene => this;

  bring_to_front = (...mObjects: MObject[]): Scene => this;

  clear = (): Scene => this;

  compile_animation_data = (
    animations: Animation[],
    skip_rendering?: boolean,
  ): Scene => this;

  compile_animation = (animations: Animation[]): Scene => this;

  get_attrs = (...keys: string[]): string[] => [];

  get_mobject_family_members = (): MObject[] => [];

  get_moving_mobjects = (...animations: Animation[]) => [];

  get_restructured_mobject_list = (
    to_check: MObject[],
    to_remove: MObject[],
  ): MObject[] => [];

  get_run_time = (animations: Animation[]): number => 0;

  get_top_level_mobjects = (): MObject[] => [];

  interactive_embed = (): Scene => this;

  is_current_animation_frozen_frame = (): boolean => false;

  next_section = (
    name?: string,
    type?: string,
    skip_animations?: boolean,
  ): void => undefined;

  pause = (duration?: number): Scene => this;

  play = (
    animations: Animation[],
    subCaption?: string,
    subcaption_duration?: number,
    subcaption_offset?: number,
  ): Scene => this;

  play_internal = (skip_rendering?: boolean): void => undefined;

  remove = (...mobjects: MObject[]): Scene => this;

  remove_foreground_mobject = (mobject: MObject): Scene => this;

  remove_foreground_mobjects = (...mobjects: MObject[]): Scene => this;

  render = (preview?: boolean): void => undefined;

  restructure_mobject = (
    to_remove: MObject,
    mobject_list_name?: string,
    extract_families?: boolean,
  ): Scene => this;

  setup = (): void => undefined;

  should_update_mobjects = (): void => undefined;

  tear_down = (): void => undefined;

  update_mobjects = (time_between_frame: number): Scene => this;

  wait = (
    duration?: number,
    stop_condition?: boolean | (() => void),
    frozen_frame?: boolean,
  ): void => undefined;

  wait_until = (stop_condition: () => void, max_time?: number): void =>
    undefined;
}
