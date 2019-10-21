export class WinnerModel {

  id: number;
  winner: string;
  date: string;

  clear() {
    this.id = 0;
    this.winner = '';
    this.date = '';
  }

  constructor(init?: Partial<WinnerModel>) {
    if (init) {
      this.id = init.id;
      this.winner = init.winner || '';
      this.date = init.date || '';
    } else {
      init.clear();
    }
  }

}

