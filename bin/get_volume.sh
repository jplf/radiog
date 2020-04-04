#!/bin/bash
#______________________________________________________________________________

# Script get volume - Jean-Paul Le Fèvre March  2020
# It just prints the number.

# It uses a Perl regular expression in the grep command.
# See perlre(1) - Why backslash K ?
# See also onair.sh
#______________________________________________________________________________

regex="Left.+ \[\K(\d+)"

echo '75'

#______________________________________________________________________________

