#! /bin/sh
#______________________________________________________________________________

# Script used to investigate the udev behaviour

# See also /etc/udev/rules.d/50-bluetooth.rules or in ../etc

# On a raspberry interesting attributes seem to be unavailable.
# Jean-Paul Le Fèvre - November 2021
#______________________________________________________________________________

log=/home/lefevre/work/hub/radiog/run/udev.log

when=$(/bin/date "+%H h. %M m. %S s")

echo  "$when - $@" >> $log

exit 0

#______________________________________________________________________________
