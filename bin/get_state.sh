#!/bin/bash
#______________________________________________________________________________

# Script get state - Jean-Paul Le Fèvre March 2020
#
# It generates a json formatted string giving the current state
# of the application. It is usually called from the server in module box.js
# Useful parameters are made available from this string.
#
# See also onair.sh
# @copyright Gnu general public license (http://www.gnu.org/licenses/gpl.html)
#______________________________________________________________________________

if [ -z "$RADIOG_HOME" ]; then
    echo "RADIOG_HOME undefined !"
    exit 1
fi

dir=$RADIOG_HOME/run
if [ ! -d "$dir" ]; then
    echo "Can't find directory $dir !"
    exit 1
fi

out=/tmp/radiog.state

echo "{" >$out
s=`/bin/date "+%H h %M m %S s    %A %d %h %Y"`
echo "\"radiog\":" "\"$s\",">>$out

echo " " >>$out
log=$dir/onair.log
if [ -f $log ]; then
    s=`/bin/tail -1 $log`
    echo "\"onair\":" "\"$s\",">>$out
else
    echo "\"onair\":" "\"empty\",">>$out
fi

echo " " >>$out
pid=`/sbin/pidof -s mplayer`

if [ -n "$pid" ]; then
    s=`/bin/ps -p $pid --no-headers -o "%U %p %a"`
else
    s=""
fi
echo "\"mplayer\":" "\"$s\"">>$out
echo "}" >>$out

cat $out

#______________________________________________________________________________

