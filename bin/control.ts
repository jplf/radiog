#!/usr/bin/env ts-node
//_____________________________________________________________________________

// A typescript command used to control remotely the player.
// Jean-Paul Le Fèvre - April 2020

// See also player.sh
// Warning it is just meant to test various solutions.
// A lot of typescript features are not yet understood.

// Examples :
// help
// load buzz.mp3
// load http://direct.fipradio.fr/live/fip-midfi.mp3
// pause
// stop

//_____________________________________________________________________________

import * as readline from 'readline';
const FIFO = require('fifo-js')

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let fifo = new FIFO(process.env.RADIOG_HOME + '/run/mpgctrl');

rl.setPrompt('? ');
rl.prompt();

rl.on('line', function(line) {

    line = line.trim();
    
    switch(line) {
    case 'help':
        console.log('control : help, exit');
        console.log('player  : load something, pause, stop, quit');
        break;
        
    case 'exit':
        console.log('exiting !');
        fifo.close();
        rl.close();
        return;
        
    default:
        fifo.writeSync(line);
        break;
    }
    
    rl.prompt();
    
}).on('close', function() {
    console.log('See you later !');
    process.exit(0);
});
//_____________________________________________________________________________


