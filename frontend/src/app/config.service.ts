import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './config';

import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    private config: Config;

    constructor(private http: HttpClient) {
    }

    // Loads the configuration. It returns a promise.
    loadConfig() : Promise<Config> {
        return this.getConfig().toPromise()
            .then(data => {
                console.log("Promised");
                this.config = { ...data };
                return data;
            });
    }

    // Reads the configuration from the asset directory
    // It returns an observable.
    getConfig() : Observable<Config> {

        let radiogConf = 'radiog-conf.json';
        if (environment.hasOwnProperty('configFile')) {
            radiogConf = environment['configFile'];
        }
        //console.log(environment);
        console.log('Configuration found in ' + radiogConf);

        return this.http.get<Config>('/assets/' + radiogConf);
    }

    // Returns the config object
    get configuration(): Config {
        return this.config;
    }

    // Returns the current version string. Note the typescript syntax
    get version(): string {
        return this.config.version;
    }

    // Returns the volume of the radio
    get volume(): number {
        return this.config.volume;
    }

    // Returns the end point of the backend player
    get playerUrl(): string {

        if (!this.config) {
            throw Error('Config file not loaded !');
        }

        return this.config.playerUrl;
    }

}
