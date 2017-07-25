var bleno = require("bleno");

var BlenoPrimaryService = bleno.PrimaryService;

var EchoCharacteristic = require('./characteristic');

console.log('bleno - echo');

bleno.on('stateChange', function (state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('echo', ['ec00'], function (err) {
            if (err) {
                console.log(err);
            }
        });
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function (error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (error) {
        console.log("Error occurred");
        return;
    }

    bleno.setServices([
        new BlenoPrimaryService({
            uuid: 'ec00',
            characteristics: [
                new EchoCharacteristic()
            ]
        })
    ]);
});