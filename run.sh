#!/usr/bin/env bash

case "$1" in
("peripheral")
    echo "Running peripheral"
    make -C peripheral
    cp peripheral/build/merged/peripheral.hex /run/media/$USER/MBED
    ;;

("peripheral_test")
    echo "Running peripheral test"
    cd peripheral_test/src
    node run.js
    ;;

("phone_app")
    echo "Running phone app"
    cd phone_app
    tns run android
    ;;

(*)
    echo "Required syntax: ./run.sh [peripheral_test|phone_app]"
    ;;

esac
