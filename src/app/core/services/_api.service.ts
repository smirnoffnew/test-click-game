import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment as env} from '../../../environments/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {GameModeModel} from '../models/gameMode.model';
import {WinnerModel} from '../models/winner.model';

@Injectable({providedIn: 'root'})
export class ApiService {

  subscribeEvent = new BehaviorSubject([]);

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'})
  };

  constructor(
    private httpClient: HttpClient
  ) {
    this.gameWinners();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (body: any): Observable<T> => {
      console.error('Full description of the BUG: ', body);

      this.log(`${operation}() ERROR : `, body);

      return of(result as T);
    };
  }

  private log(message: string, obj?: {}) {
    console.info(`ApiService: ${message}`, obj);
  }

  getList(): Observable<any> {
    return this.subscribeEvent;
  }

  gameSettings(): Observable<any> {
    return this.httpClient.get( env.api + 'game-settings', this.httpOptions)
    .pipe(
      tap( (item) => this.log('settings :', item) ),
      map((setting) => {
        const settingList = [];
        Object
          .keys(setting)
          .forEach( (item) => {
            settingList.push(
              new GameModeModel({
                name: item,
                delay: setting[item].delay,
                field: setting[item].field
              })
            );
          });
        return settingList;
      }),
      catchError(this.handleError('gameSettings()', [new GameModeModel()]) )
    );
  }

  gameWinners(): any {
    return this.httpClient
      .get( env.api + 'winners', this.httpOptions)
      .pipe(
        tap( (item) => this.log('winners :', item) ),
        catchError(this.handleError('gameWinners()', []) )
      )
      .subscribe((list: any) => this.subscribeEvent.next(list));
  }

  sentResult(post: WinnerModel) {
    return this.httpClient
      .post( env.api + 'winners', post,  this.httpOptions)
      .subscribe(() => this.gameWinners());
  }

}
