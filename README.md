# Air Pollution Monitor

Bluetooth LE project designed to monitor the air pollution levels.

## Components

This project may be split into three main components:

- MBED Program to broadcast the air pollution of the devices current location
- NativeScript Phone application that collects the nearby pollution levels from
each device
- Test air pollution device written in NodeJS for quick debugging of the phone
application

## Compiling

Clone the repository

`git clone git@github.com:novucs/air-pollution-monitor.git`

Move into the project directory

`cd air-pollution-monitor`

Execute the compile script

`./compile.sh`

## Running

Follow the clone and change directory instructions under `Compiling`. Depending
on which project you would like to compile, execute the relevant run script:


Peripheral Test:

`./run.sh peripheral_test`

Phone App:

`./run.sh phone_app`
