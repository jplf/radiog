import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbButtonsModule, NgbPopoverModule,
         NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationComponent } from './station/station.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    StationListComponent,
    MessagesComponent,
    StationComponent
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
