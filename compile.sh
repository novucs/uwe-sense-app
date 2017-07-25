#!/usr/bin/env bash

case "$1" in
("peripheral")
    make -C peripheral
    ;;

("peripheral_test")
    npm install --prefix peripheral_test
    ;;

("phone_app")
    npm install --prefix phone_app
    ;;

(*)
    make -C peripheral
    npm install --prefix peripheral_test
    npm install --prefix phone_app
    ;;
esac
