import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {from, Subject, of} from 'rxjs';
import {concatMap, delay, takeUntil} from 'rxjs/operators';
import {ApiService} from '../core/services/_api.service';
import {SquareModel} from '../core/models/square.model';
import {GameModeModel} from '../core/models/gameMode.model';
import {WinnerModel} from '../core/models/winner.model';


interface SettingInterface {
  level: GameModeModel;
  name: string;
}


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnDestroy {

  private destroyStream$ = new Subject<void>();

  // SettingsGame
  toppingList: GameModeModel[] = [];
  gameSettings: FormGroup;

  // ChipboardGame
  chipboardSquares: SquareModel[] = [];
  @ViewChild('ChipboardWidth', {static: false}) ChipboardWidth: ElementRef;

  // Message
  message = '';
  playAgain = false;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.gameSettings = this.fb.group({
      level: [null, Validators.required],
      name: [null, Validators.required]
    });

    this.apiService.gameSettings()
      .subscribe((setting: any[]) => {
        this.toppingList = setting;
        this.initChipboardGame(this.toppingList[0]);
      });
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }


  private initChipboardGame(quantitySquares: GameModeModel) {
    this.chipboardSquares = [];
    this.gameSettings.patchValue({level: quantitySquares});

    for (let i = 0; i < (quantitySquares.field * 2); i++) {
      this.chipboardSquares.push(new SquareModel({id: i}));
    }

    const boardLength = this.chipboardSquares.length;
    const boardWidth = this.ChipboardWidth.nativeElement.style;

    if (boardLength > 9 && boardLength < 13) {
      boardWidth.width = `${3 * 50}px`;
    } else if (boardLength > 12 && boardLength < 17) {
      boardWidth.width = `${4 * 50}px`;
    } else if (boardLength > 16 && boardLength < 26) {
      boardWidth.width = `${5 * 50}px`;
    } else if (boardLength > 24 && boardLength < 37) {
      boardWidth.width = `${6 * 50}px`;
    } else if (boardLength > 36 && boardLength < 50) {
      boardWidth.width = `${7 * 50}px`;
    } else if (boardLength > 49 && boardLength < 65) {
      boardWidth.width = `${8 * 50}px`;
    } else if (boardLength > 64) {
      boardWidth.width = `${9 * 50}px`;
    }

    this.cdr.detectChanges();
  }

  private randomSquares(): number[] {
    const min = 0;
    const maxNumberSquares: number = this.chipboardSquares.length;

    const exitIdNumbers: number[] = [];
    const result: number[] = [];

    for (let i = min; i < maxNumberSquares; i++) {
      exitIdNumbers.push(i);
    }

    for (let i = 0; i < maxNumberSquares; i++) {
      const range = Math.floor(Math.random() * (exitIdNumbers.length - min)) + min;
      const firstElement = exitIdNumbers.splice(range, 1)[0];
      result.push(firstElement);
    }

    return result;
  }

  private toggleActiveSquares(id) {
    this.chipboardSquares.find((element) => element.id === id && (element.active = !element.active));
    this.cdr.detectChanges();
  }

  /**
   * start game
   */
  onSubmit() {
    const setting: SettingInterface = this.gameSettings.value;
    this.destroyStream$.next();

    const randomSquaresArr: number[] = this.randomSquares();
    const settingDelay = setting.level.delay;

    // start random activation
    from(randomSquaresArr)
      .pipe(
        concatMap(x => of(x)
          .pipe(
            delay(settingDelay)
          )
        ),
        takeUntil(this.destroyStream$)
      )
      .subscribe((id) => {
        this.toggleActiveSquares(id);

        setTimeout(() => {
          this.toggleActiveSquares(id);

          this.userDontClickSquare(id);

          this.endGame(randomSquaresArr, id);

          this.cdr.detectChanges();
        }, settingDelay);
      });
  }


  private userDontClickSquare(squareId: number) {
    this.chipboardSquares
      .find((element) => this.checkActiveSquare(element, {id: squareId}) && (element.losing = true));
  }

  userClickSquare(square: SquareModel) {
    if (square.active) {
      this.chipboardSquares.find((element) => this.checkActiveSquare(element, square) && (element.win = true));
    }
  }

  private checkActiveSquare = ({id, losing, win}, square) => id === square.id && !losing && !win;

  private endGame(randomSquaresArr, activeSquareId) {
    const setting: SettingInterface = this.gameSettings.value;
    const lastElement = randomSquaresArr[randomSquaresArr.length - 1];

    if (lastElement === activeSquareId) {

      let pointsComputer = 0;
      let pointsPlayer = 0;

      this.chipboardSquares.forEach((item: SquareModel) => {
        item.losing && (pointsComputer += 1);
        item.win && (pointsPlayer += 1);
      });

      this.playAgain = true;

      const name = pointsComputer > pointsPlayer ? 'Computer' : setting.name;
      const date = new Date().toLocaleString();

      const winner = new WinnerModel({winner: name, date});

      this.showGameResult(winner);

      this.apiService.sentResult(winner);

      this.newGame();
    }
  }

  private newGame() {
    this.initChipboardGame(this.gameSettings.get('level').value);
  }

  private showGameResult(who: WinnerModel) {
    this.message = `${who.winner} is win`;
  }
}
