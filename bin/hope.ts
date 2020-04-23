#!/usr/bin/env ts-node

const fsPromises = require('fs').promises;

//var fifo='/home/lefevre/work/git/misc/radiog/run/mpgctrl'
var fifo='/tmp/testpipe'

function myHope(cmd: string, fifo: string) {
    Promise.resolve('start')
        .then(value => {
            console.log(value);
            return fsPromises.open(fifo, 'w');
        })
        .then(fh => {
            fh.write(cmd);
            console.log(cmd);
        })
        .catch(() => {
            console.log('Too bad !');
        });
}

myHope('pause', fifo);
