#!/bin/bash
#______________________________________________________________________________

# Fichier stop radiok - Jean-Paul Le Fèvre March 2020
# It may used to kill a running radio player.
# See also onair.sh
#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "RADIOG_HOME undefined !"
    exit 1
fi

dir=$RADIOG_HOME/run
if [ ! -d "$dir" ]; then
    echo "Can't find directory $dir !"
    exit 1
fi

log=$dir/onair.log
pidfile=$dir/mplayer.pid

echo "Killing onair on `date` ..." >>$log

if [ -f $pidfile ]; then
    cat $pidfile
else
    echo "No $pidfile file found !" >>$log
fi

# These commands may fail gently.
/bin/killall -q -u $USER mplayer >>$log
/bin/rm -f $pidfile

#______________________________________________________________________________

