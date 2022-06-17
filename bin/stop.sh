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

# Choose 321 or 123
echo "Killing mpg123"
$do_kill "mpg123"

echo "Killing backend"
$do_kill "node"

# Stop the monitoring of the udev actions, but only on RPI Ubuntu.
if [ ! -f /etc/slackware-version ]; then
    $do_kill "inotifywait"
fi

# Don't know why sound messes up with the keyboard
if [ -f "$HOME/.keyboard" ]; then
    /usr/bin/xmodmap $HOME/.keyboard
fi

exit 0

#______________________________________________________________________________
