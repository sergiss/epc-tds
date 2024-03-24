"use strict";
/*
* EPC Tag Data Standard
* Decode/Encode Examples
* 2024 Sergio S. - https://github.com/sergiss/epc-tds
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require("."));
// ---------------------------------
// ****** Decode from hex EPC ****** 
// ---------------------------------
// e.g. 1: SGTIN-96
let epc = _1.default.valueOf("3074257BF7194E4000001A85"); // sgtin-96
console.log("** SGTIN-96 **");
console.log("Type: " + epc.getType()); // TDS ID
console.log("Filter: " + epc.getFilter()); // filter index
console.log("HexEPC: " + epc.toHexString()); // HEX EPC
console.log("Tag URI: " + epc.toTagURI());
console.log("");
// e.g. 2: SSCC-96
epc = _1.default.valueOf("317A7202CC164BA20B000000"); // sscc-96
console.log("** SSCC-96 **");
console.log("Type: " + epc.getType()); // TDS ID
console.log("Filter: " + epc.getFilter()); // filter index
console.log("HexEPC: " + epc.toHexString()); // HEX EPC
console.log("Tag URI: " + epc.toTagURI());
console.log();
// ----------------------------------------
// ****** Encode Sgtin96 from values ******
// ----------------------------------------
// e.g. 1: EAN + Serial
let sgtin = new _1.default.Sgtin96().setFilter(3)
    .setPartition(5)
    .setGtin("00001234523457")
    .setSerial(1823342345);
console.log("** SGTIN-96 **");
console.log("HexEPC: " + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();
// e.g. 2: (companyPrefix + ItemReference) + Serial
sgtin = new _1.default.Sgtin96().setFilter(3)
    .setPartition(5)
    .setCompanyPrefix(78952)
    .setItemReference(44235)
    .setSerial(1010011010);
console.log("** SGTIN-96 **");
console.log("HexEPC: " + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();
// e.g. 3: Tag URI
sgtin = _1.default.fromTagURI('urn:epc:tag:sgtin-96:3.0614141.812345.6789');
console.log("** SGTIN-96 **");
console.log("HexEPC: " + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();
