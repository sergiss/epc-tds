/*
* EPC Tag Data Standard
* 2021 Sergio S.
*/

'use strict'
var tds = require("./index.js");

const ITERATIONS = 10000;

function test(t, n) {
    let startTime = new Date().getTime();
    t(n);
    return new Date().getTime() - startTime;
}

let time;
function gsrn96Test(n) {
    let epc, gsrn;
    for(let i = 0; i < n; ++i) {
        gsrn = tds.Utils.randomEan(18);
        epc = new tds.Gsrn96().setFilter(3).setPartition(6).setGsrn(gsrn);
        epc = new tds.Gsrn96(epc.toHexString());
        if(gsrn !== epc.getGsrn()) {
            console.log(epc.toIdURI());
            throw Error(`Gsrn96, expected GIAI: ${gsrn}, current: ${epc.getGsrn()}`);
        }
    }
    //console.log(epc.toHexString())
}
time = test(gsrn96Test, ITERATIONS);
console.log("Test Gsrn96 time: " + time);

function giai96Test(n) {
    let epc, giai;
    for(let i = 0; i < n; ++i) {
        giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        epc = new tds.Giai96().setFilter(3).setPartition(6).setGiai(giai);
        epc = new tds.Giai96(epc.toHexString());
        if(giai !== epc.getGiai()) {
            console.log(epc.toIdURI());
            throw Error(`Giai96, expected GIAI: ${giai}, current: ${epc.getGiai()}`);
        }
    }
    //console.log(epc.toHexString())
}
time = test(giai96Test, ITERATIONS);
console.log("Test Giai96 time: " + time);

function giai202Test(n) {
    let epc, giai;
    for(let i = 0; i < n; ++i) {
        giai = String(Math.floor(Math.random() * 999999)).padStart(6, '0') + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        epc = new tds.Giai202().setFilter(3).setPartition(6).setGiai(giai);
        epc = new tds.Giai202(epc.toHexString());
        if(giai !== epc.getGiai()) {
            console.log(epc.toIdURI());
            throw Error(`Giai202, expected GIAI: ${giai}, current: ${epc.getGiai()}`);
        }
    }
    //console.log(epc.toHexString())
}
time = test(giai202Test, ITERATIONS);
console.log("Test Giai202 time: " + time);

function grai170Test(n) {
    let epc, grai;
    for(let i = 0; i < n; ++i) {
        grai = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        epc = new tds.Grai170().setFilter(3).setPartition(6).setGrai(grai);
        epc = new tds.Grai170(epc.toHexString());
        if(grai !== epc.getGrai()) {
            console.log(epc.toIdURI());
            throw Error(`Grai170, expected GRAI: ${grai}, current: ${epc.getGrai()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(grai170Test, ITERATIONS);
console.log("Test Grai170 time: " + time);

function grai96Test(n) {
    let epc, grai;
    for(let i = 0; i < n; ++i) {
        grai = tds.Utils.randomEan(13) + Math.floor(Math.random() * tds.Utils.getMaxValue(16));
        epc = new tds.Grai96().setFilter(3).setPartition(6).setGrai(grai);
        epc = new tds.Grai96(epc.toHexString());
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
        ean = tds.Utils.randomEan(18);
        epc = new tds.Sscc96().setFilter(3).setPartition(6).setSscc(ean);
        epc = new tds.Sscc96(epc.toHexString());
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
        gtin = tds.Utils.randomEan(14);
        epc = new tds.Sgtin96().setFilter(3).setPartition(6).setGtin(gtin).setSerial(Math.floor(Math.random() * tds.Sgtin96.MAX_SERIAL));
        epc = new tds.Sgtin96(epc.toHexString());
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
        gtin = tds.Utils.randomEan(14);
        epc = new tds.Sgtin198().setFilter(3).setPartition(6).setGtin(gtin).setSerial(tds.Utils.randomHex(tds.Sgtin198.MAX_SERIAL_LEN));
        epc = new tds.Sgtin198(epc.toHexString());
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
        ean = tds.Utils.randomEan(13);
        epc = new tds.Sgln96().setFilter(3).setPartition(6).setGln(ean).setExtension(Math.floor(Math.random() * tds.Sgln96.MAX_EXTENSION));
        epc = new tds.Sgln96(epc.toHexString());
        if(ean !== epc.getGln()) {
            throw Error(`Sgln96, expected GLN: ${ean}, current: ${epc.getGln()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sgln96Test, ITERATIONS);
console.log("Test Sgln96 time: " + time);

function sgln195Test(n) {
    let epc, ean;
    for(let i = 0; i < n; ++i) {
        ean = tds.Utils.randomEan(13);
        epc = new tds.Sgln195().setFilter(3).setPartition(6).setGln(ean).setExtension(tds.Utils.randomHex(tds.Sgln195.MAX_SERIAL_LEN));
        epc = new tds.Sgln195(epc.toHexString());
        if(ean !== epc.getGln()) {
            throw Error(`Sgln195, expected GLN: ${ean}, current: ${epc.getGln()}`);
        }
    }
    //console.log(epc.toHexString())
    //console.log(epc.getGtin());
}
time = test(sgln195Test, ITERATIONS);
console.log("Test Sgln195 time: " + time);

function gid96Test(n) {
    let epc;
    for(let i = 0; i < n; ++i) {
       
        let manager = Math.floor(Math.random() * tds.Gid96.MAX_MANAGER);
        let clazz   = Math.floor(Math.random() * tds.Gid96.MAX_CLASS);
        let serial  = Math.floor(Math.random() * tds.Gid96.MAX_SERIAL);
        epc = new tds.Gid96().setManager(manager).setClass (clazz).setSerial (serial);
        epc = new tds.Gid96(epc.toHexString());
        if(manager !== epc.getManager() || clazz !== epc.getClass() || serial != epc.getSerial()) {
            throw Error(`Gid96, expected: [${manager}, ${clazz}, ${serial}] current: [${epc.getManager()}, ${epc.getClass()}, ${epc.getSerial()}]`);
        }
    }
    //console.log(epc.toHexString())
}
time = test(gid96Test, ITERATIONS);
console.log("Test Gid96 time: " + time);

console.log("*** Test completed successfully! ***");