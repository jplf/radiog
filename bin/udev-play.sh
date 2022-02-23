#! /bin/bash
#______________________________________________________________________________

# Script used to start or stop the backend player.

# It starts when the bluetooth device is switched on
# and stops when the device is swiched off. So it is no longer necessary
# to stop both the player and the bluetooth loud speaker.

# See also : 50-bluetooth.rules and  51-bluetooth.rules

# Option -p : play
# Option -m : mute

# Jean-Paul Le Fèvre - December 2021
#______________________________________________________________________________

# For this preliminary release.
log=/home/lefevre/work/hub/radiog/run/udev.log

usage="Usage : udev-play.sh [-h] -p | -m # play or mute"

if [ -z "$1" ]; then
    echo "$usage"
    exit 1
fi

# The udev rule does not provide the URL.
if [ -z "$RADIOG_URL" ]; then 
    export RADIOG_URL=https://localhost:3000
fi

# Make sure that the server is online, otherwise exit.
status=`curl -Is $RADIOG_URL/player | head -n 1`
if [ -z "$RADIOG_URL" ]; then 
    echo "RadioG is not yet running"
    exit 1
fi

when=`\date "+%Y-%m-%d %H:%M"`

while [ -n "$1" ];do
case    $1 in
        -h)     echo $usage
                exit 0 ;;
        
        -p)     echo "$when start playing at $RADIOG_URL" >> $log
                curl -sk $RADIOG_URL/player/on
                exit 0 ;;

        -m)     echo "$when stop  playing at $RADIOG_URL" >> $log
                curl -sk $RADIOG_URL/player/off
                exit 0 ;;

        -*)     echo $usage
                exit 1 ;;
esac
shift
done

#______________________________________________________________________________
