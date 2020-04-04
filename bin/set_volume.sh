#!/bin/bash
#______________________________________________________________________________

# Script set_volume - Jean-Paul Le Fèvre March 2020
# Usage: set_volume value [%|+|-]

# When the second parameter is null or '%' the volume is set to the
# specified value. When it is '+' or '-' the current volume value is
# increased or decreased. Otherwise the volume is not charged.

# See also amixer(1) onair.sh
#______________________________________________________________________________

# Set the new value.
if [ -z "$1" ]; then
    vol=10
else
    vol=$1
fi

if [ -z "$2" ]; then
    s="%"
elif [ "$2" = "%" ]; then
    s=$2
elif [ "$2" = "+" ]; then
    s=$2
elif [ "$2" = "-" ]; then
    s=$2
else
    exit 1
fi

# amixer -q set PCM $vol$s

# Keep track of the new value.

$RADIOG_HOME/bin/get_volume.sh > $RADIOG_HOME/run/volume

#______________________________________________________________________________

