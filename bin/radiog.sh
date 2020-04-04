#! /bin/sh
#______________________________________________________________________________

# Script used to start the server
# Jean-Paul Le Fèvre - March 2020
#______________________________________________________________________________

export NODE_PATH=/usr/local/lib/node_modules
export RADIOG_HOME=$HOME/work/git/misc/radiog
export PATH=/bin:/usr/bin:/usr/local/bin:$HOME/bin:$RADIOG_HOME/bin

cd $RADIOG_HOME/run

# Clean up any remaining timestamps.
rm -f timestamp.?
# Note the current time.
# On the RPi the time is not locally kept. Clock is set by the ntp program
# and one must make sure that this initialization is properly performed.
# This may be checked by comparing the timestamp created in start.sh
touch timestamp.0

sleep 300
$RADIOG_HOME/bin/start.sh

#______________________________________________________________________________
