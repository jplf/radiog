#!/usr/bin/env ts-node

const fs = require('fs').promises;

var path='/home/lefevre/work/git/misc/radiog/etc/stations.json';

async function myHope(path:string) : Promise<string[]> {
    
    return Promise.resolve(path)
            .then(file => {
                return fs.readFile(file, 'utf-8');
            })
            .then (content => {
                return JSON.parse(content).stations;
            })
            .then (content => {
                console.log("parsed");
                return content;
            })
            .catch((err) => {
                console.log("wtf ? " + err);
            });

}

myHope(path).then(content => {console.log(content)} );
