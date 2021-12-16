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

echo "Killing backend"
$do_kill "node"
# Now the frontend is managed by systemctl nginx 

# Don't know why sound messes up with the keyboard
if [ -f "$HOME/.keyboard" ]; then
    /usr/bin/xmodmap $HOME/.keyboard
fi

exit 0

#______________________________________________________________________________
