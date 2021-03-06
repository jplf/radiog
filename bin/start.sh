#! /bin/sh
#______________________________________________________________________________

# Script used to start the backend server.
# Use something like 'screen -S RadioG' and '$RADIOG_HOME/bin/start.sh'
# It checks the environment and starts the player.

# As of April 2021 this application has been reconfigured.
# The frontend must be built by the Angular ng build command
# It is served by nginx which can be started by systemctl start nginx

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

cd $RADIOG_HOME/backend
echo "Backend server is being started, be patient !" | tee ../run/backend.log

npm run start 1>>../run/backend.log 2>../run/backend.err &

cd $RADIOG_HOME/run
touch timestamp.1

# Make sure the server is ready.
sleep 30

echo "Backend server is now accepting requests !" | tee -a ../run/backend.log
curl -s http://localhost:18300/player | jq
curl -s http://localhost:18300/device/info | jq
echo "curl -s http://localhost:18300/player/listen/10"

# The frontend server is managed by nginx.
cd $RADIOG_HOME/run
sudo systemctl status nginx 1>>frontend.log

touch timestamp.2
echo "Check the log files if necessary"

echo "The RadioG is about to be available but be patient !"
echo "Verify the backend on port 18300"
echo "Make sure that the bluetooth device is connected"

exit 0

#______________________________________________________________________________
