#! /bin/sh
#______________________________________________________________________________

# Script used investigate udev behaviour
# Jean-Paul Le Fèvre - November 2021
#______________________________________________________________________________

log=/home/lefevre/work/hub/radiog/run/udev.log

when=$(/bin/date "+%H h. %M m. %S s")
echo "Probing udev output at $when " >>$log
echo  "CL args : $@" >> $log

#______________________________________________________________________________
