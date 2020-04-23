#!/bin/sh
#______________________________________________________________________________

# Script used launch and control the mpg123 player.
# Jean-Paul Le Fèvre - April 2020

# Usage : player.sh
# It can be controlled by sending command in the fifo.
# The working directory is $RADIOG_HOME/run

# See also control.ts
#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "export RADIOG_HOME="
    exit 1
fi

rundir=$RADIOG_HOME/run
fifo=$rundir/mpgctrl
pidfile=$rundir/mpg.pid

if [ -f $pidfile ]; then
    echo "A player may be still running. Kill it."
    echo "The pid is : " `cat $pidfile`
    /bin/killall -9 /usr/bin/mpg123
    /bin/rm $pidfile
    echo "Rerun the command"
    exit 1
fi


echo "Launching the radiog player ..."
/usr/bin/mpg123 -R --fifo $fifo 1>/dev/null &

echo $! > $pidfile
echo "The radiog player is " `cat $pidfile`

#______________________________________________________________________________
