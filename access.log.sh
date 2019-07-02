#!/bin/sh
cd /Users/spark/Desktop/createNodeServer/logs
cp access.log $(date +%Y-%m-%d).access.log
echo $(date +%H:%M)\n > access.log