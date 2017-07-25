#!/usr/bin/env bash

cd peripheral
make

cd ../peripheral_test
npm install

cd ../phone_app/
npm install
