#! /bin/bash
#______________________________________________________________________________

# Script used to start the server in a screen session
# Jean-Paul Le Fèvre - June 2022
#______________________________________________________________________________

export RADIOG_HOME=$HOME/work/hub/radiog
export RADIOG_URL=https://localhost:3000
export RADIOG_CONF=/home/lefevre/etc/radiog.conf

screen -ls RadioG
screen -wipe RadioG

screen -LmdS RadioG bash -c '$RADIOG_HOME/bin/start.sh; exec bash'

#______________________________________________________________________________
