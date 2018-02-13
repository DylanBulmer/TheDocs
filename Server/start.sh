#!/bin/bash
# include this boilerplate
function jumpto
{
    label=$1
    cmd=$(sed -n "/#$label:/{:a;n;p;ba};" $0 | grep -v ':$')
    eval "$cmd"
    exit
}

start=${1:-"start"}

jumpto $start

#start:
node server

echo "Would you like to restart the server? (Y/N)"
#ask:
read answer
if answer == "y" || answer == "Y"; then
	jumpto $start
elif answer == "n" || answer == "N"; then
	echo "Exiting"
	exit 1
else
	echo "Enter Y or N"
	jumpto ask;
fi

# Yes I created a goto in bash, leave me and my needs for a goto alone.