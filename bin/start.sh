#! /bin/sh
#______________________________________________________________________________

# Script used to start the backend and frontend servers.
# Use something like 'screen -S RadioG' and '$RADIOG_HOME/bin/start.sh'
# It checks the environment and starts.

# Jean-Paul Le Fèvre - June 2020
# @copyright Gnu general public license (http://www.gnu.org/licenses/gpl.html)

#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "export RADIOG_HOME="
    exit 1
fi

if [ -z "$RADIOG_CONF" ]; then
    echo "export RADIOG_CONF="
    exit 1
fi

cd $RADIOG_HOME/run

echo "Check the configured values"
cat $RADIOG_CONF
cat $RADIOG_HOME/frontend/src/assets/radiog-conf.json

# Check the current time to make comparison possible with timestamp.0
touch timestamp.0

rm -f screenlog.? 2>/dev/null
mv -f *.log ../tmp/  2>/dev/null

# Launch the backend server.
echo "Backend server is being started !"

cd $RADIOG_HOME/backend
npm run start 1>../run/backend.log 2>../run/backend.err &

cd $RADIOG_HOME/run
touch timestamp.1

# Make sure the server is ready.
sleep 30

echo "Backend server is now accepting requests !"
curl -s http://localhost:18300/player | jq
curl -s http://localhost:18300/device/info | jq

# Launch the frontend server.
echo "Frontend server is being started !"

cd $RADIOG_HOME/frontend

ng serve --host $HOSTNAME --port 18301 \
1>../run/frontend.log 2>../run/frontend.err &

echo "Frontend server is now online !"
echo "Go to http://$HOSTNAME:18301"


cd $RADIOG_HOME/run
touch timestamp.2
echo "Check the log files if necessary"

echo "The RadioG is about to be available but be patient !"
echo "Verify the backend on port 18300 and the frontend on port 18301"
echo "Make sure that the bluetooth device is connected"

exit 0

#______________________________________________________________________________
