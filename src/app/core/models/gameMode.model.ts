export class GameModeModel {
  name: string;
  delay: number;
  field: number;

  clear() {
    this.name = 'Default';
    this.delay = 2000;
    this.field = 3;
  }

  constructor(init?: Partial<GameModeModel>) {
    if (init) {
      this.name = init.name;
      this.delay = init.delay;
      this.field = init.field;
    } else {
      this.clear();
    }
  }
}
