#!/bin/sh

cd minecraft
if ! pgrep java > /dev/null
then
  java -Xmx768M -Xms412M -jar minecraft_server.1.8.3.jar nogui &
fi
