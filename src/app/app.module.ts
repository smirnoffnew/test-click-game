import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ApiService} from './core/services/_api.service';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GameComponent} from './game/game.component';
import {WinnerListComponent} from './winner-list/winner-list.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    WinnerListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule, MatInputModule, MatButtonModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
