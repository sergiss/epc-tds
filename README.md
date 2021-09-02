# epc-tds
EPC Tag Data Standard encoding and decoding library, written in javascript for Node.js

Simple, very fast and easy to use ;)

[![NPM Version][npm-image]][npm-url]

## Usage

### Automatic decoding of any standard
```js

const tds = require('epc-tds');
var epc = tds.valueOf("3074257bf7194e4000001a85");
console.log(epc.toHexString());

```

### Decode Hex EPC
```js
// Decode from Hex EPC
let epc = Epc.valueOf("3074257BF7194E4000001A85"); // sgtin-96

// Acces to epc properties
console.log("Type: "          + epc.getType()); // TDS ID
console.log("Filter: "        + epc.getFilter()); // filter index
console.log("Partition: "     + epc.getPartition()); // partition index
console.log("CompanyPrefix: " + epc.getCompanyPrefix());
console.log("ItemReference: " + epc.getItemReference());
console.log("GTIN(EAN): "     + epc.getGtin()); // ean
console.log("HexEPC: "        + epc.toHexString()); // HEX EPC
console.log("Tag URI: "       + epc.toTagURI());

```

### Encode Hex EPC
```js

// e.g. 1: EAN + Serial
let epc1 = new Sgtin96().setFilter(3)
                        .setPartition(5)
                        .setGtin("00001234523457")
                        .setSerial(1823342345);

console.log("HexEPC: "  + epc1.toHexString()); // HEX EPC
console.log("Tag URI: " + epc1.toTagURI());
       
// e.g. 2: (companyPrefix + ItemReference) + Serial
let epc2 = new Sgtin96().setFilter(3)
                        .setPartition(5)
                        .setCompanyPrefix(78952)
                        .setItemReference(44235)
                        .setSerial(1010011010);
                        
console.log("HexEPC: "  + epc2.toHexString()); // HEX EPC
console.log("Tag URI: " + epc2.toTagURI());

```
https://www.sergiosoriano.com

[npm-url]: https://npmjs.org/package/epc-tds
