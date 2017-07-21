"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var bluetooth = require("nativescript-bluetooth");
var MainComponent = (function () {
    function MainComponent() {
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        bluetooth.hasCoarseLocationPermission().then(function (granted) {
            _this.beginScanning(granted);
        });
    };
    MainComponent.prototype.beginScanning = function (grantedPermission) {
        var _this = this;
        if (!grantedPermission) {
            bluetooth.requestCoarseLocationPermission();
        }
        console.log(this);
        bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: 4,
            onDiscovered: function (peripheral) {
                _this.peripheralFound(peripheral);
            }
        }).then(function () { return console.log("complete"); }).catch(function (error) {
            console.log("error" + error);
        });
    };
    MainComponent.prototype.peripheralFound = function (peripheral) {
        var _this = this;
        console.log("PERIPHERAL DISCOVERED, CONNECTING: " + peripheral.UUID);
        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: function (peripheral) {
                _this.peripheralConnected(peripheral);
            },
            onDisconnected: function (data) {
                console.log("Disconnected from " + peripheral.UUID + ", data: " + JSON.stringify(data));
            }
        }).then(function (data) {
            return console.log("Connection success: " + JSON.stringify(data));
        }).catch(function (error) {
            return console.log("Connection failed: " + JSON.stringify(error));
        });
    };
    MainComponent.prototype.peripheralConnected = function (peripheral) {
        console.log("CONNECTED TO " + JSON.stringify(peripheral));
        peripheral.services.forEach(function (service) {
            service.characteristics.forEach(function (characteristic) {
                console.log("READING FROM SERVICE " + service + " USING CHARACTERISTIC " + characteristic);
                bluetooth.read({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: service.UUID,
                    characteristicUUID: characteristic.UUID
                }).then(function (result) {
                    // fi. a heartrate monitor value (Uint8) can be retrieved like this:
                    var data = new Uint8Array(result.value);
                    console.log("Your heartrate is: " + data[1] + " bpm");
                }).then(function (err) {
                    console.log("read error: " + err);
                });
            });
        });
    };
    return MainComponent;
}());
MainComponent = __decorate([
    core_1.Component({
        selector: "ns-items",
        moduleId: module.id,
        templateUrl: "./connect.component.html",
    }),
    __metadata("design:paramtypes", [])
], MainComponent);
exports.MainComponent = MainComponent;
