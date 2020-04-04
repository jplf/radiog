import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbButtonsModule, NgbPopoverModule,
         NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StationsComponent } from './stations/stations.component';
import { RadioComponent } from './radio/radio.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    StationsComponent,
    MessagesComponent,
    RadioComponent
  ],
  imports: [
    BrowserModule,
      AppRoutingModule,
      NgbPopoverModule,
      NgbTooltipModule,
      NgbButtonsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
