
const FIFO = require('fifo-js')

let fifo = new FIFO('/tmp/testpipe');

fifo.writeSync('quit');

fifo.close();

