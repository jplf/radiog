#! /bin/bash
#_______________________________________________________________________________
#
# Bourne shell script : udev-proc.sh
# Jean-Paul Le Fèvre - February 2022

# Usage : udev-proc.sh.sh in background, screen(1) may also be useful.
#
# Monitor attributes of touched files in the run directory.
# When such an event occurs radiog is muted or unmuted.

# Two files are observed : muted and unmuted in the run directory.
# When they are touched by an udev rules script the backend api is called.

# See the rules in etc/51-bluetooth.rules
#_______________________________________________________________________________

# The directory to watch
dir=$RADIOG_HOME/run

# A logfile of the emitted messages, useful for debugging
log=$dir/udev.log

# See the man page of inotifywait(1)
# The end of the filepath is checked by a regexp.

inotifywait --timefmt '%H:%M' --format '%T - %w' \
            -m -e attrib $dir/muted $dir/unmuted | while read msg
do
    echo $msg >> $log
    
    if [[ "$msg" =~ /unmuted$ ]]; then
        curl -sk $RADIOG_URL/player/on
        
    elif [[ "$msg" =~ /muted$ ]]; then
        curl -sk $RADIOG_URL/player/off
    else
        echo "Invalid event message" >> $log
    fi
done

#_______________________________________________________________________________
