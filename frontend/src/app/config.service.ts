import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    private config: any;

    constructor(private http: HttpClient) {
    }
    
    // Reads the configuration from the asset directory
    loadConfig() {
        
        var radiogConf = 'radiog-conf.json';
        if (environment.hasOwnProperty('configFile')) {
            radiogConf = environment['configFile']; 
        }
        console.log(environment);
        
        console.log('Configuration found in ' + radiogConf);
        
        return this.http.get('/assets/' + radiogConf)
            .toPromise()
            .then(data => {
                this.config = data;
            });
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
