#!/bin/bash

echo "Starting the container"

if [ ! -d node_modules ]; then
    npm install
fi

# export PORT=3000
npm start
# you can precise your environment
# ng serve --host 0.0.0.0 --env=dev --port 4560
