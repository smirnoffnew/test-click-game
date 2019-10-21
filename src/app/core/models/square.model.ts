export class SquareModel {

  id: number;
  active: boolean;
  losing: boolean;
  win: boolean;

  clear() {
    this.id = 0;
    this.active = false;
    this.losing = false;
    this.win = false;
  }

  constructor(init?: Partial<SquareModel>) {
    if (init) {
      this.id = init.id;
      this.active = init.active || false;
      this.losing = init.losing || false;
      this.win = init.win || false;
    } else {
      init.clear();
    }
  }

}
