import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PRIMENG_IMPORTS } from './primeng-import';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


import { WFS }  from 'ol/format.js';
import { RestComponent } from './rest/rest.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RestComponent
  ],
  imports: [
    BrowserModule,
    PRIMENG_IMPORTS,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
