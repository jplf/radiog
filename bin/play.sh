#! /bin/sh
#______________________________________________________________________________

# Script used to start the player.
# It kills an existing player and launches mpg123(1).

# Try : play.sh $RADIOG_HOME/etc/far_from_love.mp3

# Jean-Paul Le Fèvre - May 2020
# @copyright Gnu general public license (http://www.gnu.org/licenses/gpl.html)

#______________________________________________________________________________

if [ -z "$1" ]; then
    echo "No input file specified"
    exit 1;
fi

/bin/killall -9 mpg123 2>/dev/null

/usr/bin/mpg123 -q $1 2>/dev/null

#______________________________________________________________________________
