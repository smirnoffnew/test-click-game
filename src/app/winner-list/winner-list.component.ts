import {Component, OnInit} from '@angular/core';
import {ApiService} from '../core/services/_api.service';
import {WinnerModel} from '../core/models/winner.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-winner-list',
  templateUrl: './winner-list.component.html',
  styleUrls: ['./winner-list.component.styl']
})
export class WinnerListComponent implements OnInit {

  winnersList$: Observable<WinnerModel[]>;

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.winnersList$ = this.apiService.getList();
  }

}
