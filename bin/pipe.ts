#!/usr/bin/env ts-node

const FIFO = require('fifo-js')

var fifo = new FIFO('/home/lefevre/work/git/misc/radiog/run/mpgctrl');

//fifo.writeSync('load buzz.mp3');
fifo.writeSync('quit');

fifo.close();

