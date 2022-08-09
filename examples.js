/*
* EPC Tag Data Standard
* Decode/Encode Examples
* 2021 Sergio S. - https://github.com/sergiss/epc-tds
*/

"use strict";

var tds = require("./index.js");

// ---------------------------------
// ****** Decode from hex EPC ****** 
// ---------------------------------
// e.g. 1: SGTIN-96
let epc = tds.valueOf("3074257BF7194E4000001A85"); // sgtin-96
console.log("** SGTIN-96 **")
console.log("Type: " + epc.getType()); // TDS ID
console.log("Filter: " + epc.getFilter()); // filter index
console.log("Partition: " + epc.getPartition()); // partition index
console.log("CompanyPrefix: " +  epc.getCompanyPrefix());
console.log("ItemReference: " + epc.getItemReference());
console.log("GTIN(EAN): " + epc.getGtin()); // ean
console.log("HexEPC: " + epc.toHexString()); // HEX EPC
console.log("Tag URI: " + epc.toTagURI());
console.log("");

// e.g. 2: SSCC-96
epc = tds.valueOf("317A7202CC164BA20B000000"); // sscc-96
console.log("** SSCC-96 **")
console.log("Filter: " + epc.getFilter()); // filter index
console.log("Partition: " + epc.getPartition()); // partition index
console.log("CompanyPrefix: " +  epc.getCompanyPrefix());
console.log("SerialReference: " + epc.getSerialReference());
console.log("SSCC(EAN): " + epc.getSscc()); // ean
console.log("HexEPC: " + epc.toHexString()); // HEX EPC
console.log("Tag URI: " + epc.toTagURI());
console.log();

// ----------------------------------------
// ****** Encode Sgtin96 from values ******
// ----------------------------------------
// e.g. 1: EAN + Serial
let sgtin = new tds.Sgtin96().setFilter(3)
                         .setPartition(5)
                         .setGtin("00001234523457")
                         .setSerial(1823342345);

console.log("** SGTIN-96 **")
console.log("HexEPC: "  + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();

// e.g. 2: (companyPrefix + ItemReference) + Serial
sgtin = new tds.Sgtin96().setFilter(3)
                     .setPartition(5)
                     .setCompanyPrefix(78952)
                     .setItemReference(44235)
                     .setSerial(1010011010);

console.log("** SGTIN-96 **")
console.log("HexEPC: "  + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();

// e.g. 3: Tag URI
sgtin = tds.fromTagURI('urn:epc:tag:sgtin-96:3.0614141.812345.6789');
console.log("** SGTIN-96 **")
console.log("HexEPC: "  + sgtin.toHexString()); // HEX EPC
console.log("Tag URI: " + sgtin.toTagURI());
console.log();
