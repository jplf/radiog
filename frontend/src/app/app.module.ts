import { NgModule, APP_INITIALIZER } from '@angular/core';

import { DatePipe  } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { NgbButtonsModule, NgbPopoverModule,
         NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config.service';
import { StationListComponent } from './station-list/station-list.component';
import { StationComponent } from './station/station.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule } from '@angular/forms';
import { RadioComponent } from './radio/radio.component';

@NgModule({
    declarations: [
        AppComponent,
        StationListComponent,
        MessagesComponent,
        StationComponent,
        RadioComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        NgbPopoverModule,
        NgbTooltipModule,
        NgbButtonsModule,
        FormsModule
    ],
    providers: [
        DatePipe,
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return () => {
                    console.log('The configuration is loaded');
                    return configService.loadConfig();
                };
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
