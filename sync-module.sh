#!/usr/bin/env bash

echo -e '<< SYNC >>'
echo "First arg: $1"
echo "Second arg: $2"
echo "Third arg: $3"
echo "Fourth arg: $4"

folders=($1 $2)
for item in ${folders[@]}; do
  echo "$item"
done
#for entry in "./"/*
#do
#  echo "$entry"
#done
#invites_items=(src)
#for item in ${invites_items[@]}; do
#  rsync -rtvi --delete ${item} ../syncli-test/sync-to/node_modules
#done
#
#echo -e '\n\nsynced to\n../../wix-one-app-creation/node_modules/wix-one-app-invites\n\n'
