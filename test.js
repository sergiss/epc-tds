/*
* EPC Tag Data Standard
* 2021 Sergio S.
*/

'use strict'

const { Epc } = require("./epc/epc");
const { Sgtin96 } = require("./epc/sgtin/sgtin96");
const { Sgtin198 } = require("./epc/sgtin/sgtin198");
const { Sgln96 } = require("./epc/sgln/sgln96");
const { Sscc96 } = require("./epc/sscc/sscc96");
const { Grai96 } = require("./epc/grai/grai96");
const { Grai170 } = require("./epc/grai/grai170");

const Utils = require("./epc/utils/utils");

let ITERATIONS = 10000;

function test(t, n) {
    let startTime = new Date().getTime();
    t(n);
    return new Date().getTime() - startTime;
}

function grai170Test(n) {
    let epc, grai;
    for(let i = 0; i < n; ++i) {
        grai = Utils.randomEan(13) + Math.floor(Math.random() * Utils.getMaxValue(16));
        epc = new Grai170().setFilter(3).setPartition(6).setGrai(grai);
        epc = new Grai170(epc.toHexString());
        if(grai !== epc.getGrai()) {
            console.log(epc.toIdURI());
            throw Error(`Grai170, expected GRAI: ${grai}, current: ${epc.getGrai()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
let time = test(grai170Test, ITERATIONS);
console.log("Test Grai170 time: " + time);

function grai96Test(n) {
    let epc, grai;
    for(let i = 0; i < n; ++i) {
        grai = Utils.randomEan(13) + Math.floor(Math.random() * Utils.getMaxValue(16));
        epc = new Grai96().setFilter(3).setPartition(6).setGrai(grai);
        epc = new Grai96(epc.toHexString());
        if(grai !== epc.getGrai()) {
            console.log(epc.toIdURI());
            throw Error(`Grai96, expected GRAI: ${grai}, current: ${epc.getGrai()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(grai96Test, ITERATIONS);
console.log("Test Grai96 time: " + time);

function sscc96Test(n) {
    let epc, ean;
    for(let i = 0; i < n; ++i) {
        ean = Utils.randomEan(18);
        epc = new Sscc96().setFilter(3).setPartition(6).setSscc(ean);
        epc = new Sscc96(epc.toHexString());
        if(ean !== epc.getSscc()) {
            throw Error(`Sscc96, expected SSCC: ${ean}, current: ${epc.getSscc()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sscc96Test, ITERATIONS);
console.log("Test Sscc96 time: " + time);

function sgtin96Test(n) {
    let epc, gtin;
    for(let i = 0; i < n; ++i) {
        gtin = Utils.randomEan(14);
        epc = new Sgtin96().setFilter(3).setPartition(6).setGtin(gtin).setSerial(Math.floor(Math.random() * Sgtin96.MAX_SERIAL));
        epc = new Sgtin96(epc.toHexString());
        if(gtin !== epc.getGtin()) {
            throw Error(`Sgtin96, expected GTIN: ${gtin}, current: ${epc.getGtin()}`);
        }       
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sgtin96Test, ITERATIONS);
console.log("Test Sgtin96 time: " + time);

function sgtin198Test(n) {
    let epc, gtin;
    for(let i = 0; i < n; ++i) {
        gtin = Utils.randomEan(14);
        epc = new Sgtin198().setFilter(3).setPartition(6).setGtin(gtin).setSerial(Utils.randomHex(Sgtin198.MAX_SERIAL_LEN));
        epc = new Sgtin198(epc.toHexString());
        if(gtin !== epc.getGtin()) {
            throw Error(`Sgtin198, expected GTIN: ${gtin}, current: ${epc.getGtin()}`);
        }       
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sgtin198Test, ITERATIONS);
console.log("Test Sgtin198 time: " + time);

function sgln96Test(n) {
    let epc, ean;
    for(let i = 0; i < n; ++i) {
        ean = Utils.randomEan(13);
        epc = new Sgln96().setFilter(3).setPartition(6).setGln(ean).setExtension(Math.floor(Math.random() * Sgln96.MAX_EXTENSION));
        epc = new Sgln96(epc.toHexString());
        if(ean !== epc.getGln()) {
            throw Error(`Sgln96, expected GLN: ${ean}, current: ${epc.getGln()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sgln96Test, ITERATIONS);
console.log("Test Sgln96 time: " + time);

console.log("*** Test completed successfully! ***");