#! /bin/sh
#______________________________________________________________________________

# Script used to stop the backend and frontend servers.
# It brutally kills the processes

# Jean-Paul Le Fèvre - June 2020
# @copyright Gnu general public license (http://www.gnu.org/licenses/gpl.html)

#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "export RADIOG_HOME="
    exit 1
fi

cd $RADIOG_HOME/run
do_kill="pkill -u lefevre --signal 9"

echo "Killing mpg123"
$do_kill "mpg123"

echo "Killing frontend"
$do_kill "ng serve"

echo "Killing backend"
$do_kill "node"

# Don't know why sound messes up with the keyboad
/usr/bin/xmodmap $HOME/.keyboard

exit 0

#______________________________________________________________________________
