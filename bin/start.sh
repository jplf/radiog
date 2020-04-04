#! /bin/sh
#______________________________________________________________________________

# Script used to start the server.
# It checks the environment and starts the command by screen(1).

# Jean-Paul Le Fèvre - March 2014
# @copyright Gnu general public license (http://www.gnu.org/licenses/gpl.html)

#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "export RADIOG_HOME="
    exit 1
fi

if [ -z "$NODE_PATH" ]; then
    echo "export NODE_PATH="
    exit 1
fi

if [ -z "$AUDIODEV" ]; then
    echo "export AUDIODEV="
    exit 1
fi

# Check the current time to make comparison possible with timestamp.0
touch $RADIOG_HOME/run/timestamp.1

rm -f $RADIOG_HOME/run/screenlog.? 2>/dev/null
mv -f $RADIOG_HOME/run/*.log $RADIOG_HOME/tmp 2>/dev/null

# Launch the http server.
screen -L -d -m /usr/local/bin/node $RADIOG_HOME/www/gontrol/app.js

# Make sure the server is ready.
sleep 30

# Initialize the volume on the server
if [ -f $RADIOG_HOME/run/volume ]; then
    vol=`cat $RADIOG_HOME/run/volume`
else
    vol="20"
fi

/usr/bin/curl http://localhost:18000/box/set_volume/$vol >/dev/null

#______________________________________________________________________________
