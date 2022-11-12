#!/bin/bash

# app name
appname="express.sample"
# vite config file
vitecfg="vite.config.js"
# project build folder
builddir="build"
# project image name
buildimg="$appname.docker:latest"
# server port number in env file
envport="APP_PORT"

# -------------------------------------
# double check config file
if [[ ! -f "$(pwd)/$vitecfg" ]]; then
    echo "vite config file not found"
    return 1
# -------------------------------------
# start server in development mode
elif [[ $1 = "dev" ]]; then
    NODE_ENV=development nodemon server.js
# -------------------------------------
# build app
elif [[ $1 = "build" ]]; then
    npx vite build
# -------------------------------------
# test build : a babel config targeting all browsers supporting TLSv1.2 and
# above is fed to babel-jest to compile the code against which the tests will
# run ... @babel/preset-env is therefore installed exclusively because it is
# needed for babel-jest to run and is completely irrelevant to the vite build process ..
elif [[ $1 = "test" ]]; then
    NODE_ENV=production npx jest --config ./jest.config.json
# -------------------------------------
# create coverage : for it to remain a valid indication, business logic has to be
# implemented in separate middleware functions that will sit in the middlewares/
# folder and be tested with jest before building ...
elif [[ $1 = "cover" ]]; then
    NODE_ENV=production npx jest --config ./jest.config.json --coverage
# -------------------------------------
# start server in production mode
elif [[ $1 = "prod" ]]; then
    NODE_ENV=production nodemon server.js
# -------------------------------------
# dockerize app
elif [[ $1 = 'dockerize' ]]; then
# -------------------------------------
    # double check build directory
    if [[ ! -d "$(pwd)/$builddir" ]]; then
        echo "build directory is missing"
        return 1
    fi
    # double check dockerfile
    if [[ ! -f "$(pwd)/Dockerfile" ]]; then
        echo "Dockerfile is missing"
        return 1
    fi
    # build image    
    docker build -t "$buildimg" .
    # extract service port
    port=$(grep -E ^$envport=.+$ "$(pwd)"/.env.files/.env.production | sed -E "s/^$envport=([0-9]+)$/\1/")
    # start container
    echo "----------------------"
    echo "starting container ..."
    docker container run --rm -p "$port:$port" "$buildimg"
# -------------------------------------
else
    echo "command directive not found"
    # failure
    return 1
# -------------------------------------
fi

# success
return 0