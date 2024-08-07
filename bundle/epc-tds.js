require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**
 * 96-bit Component / Part Identifier (CPI)
 *
 * The Component / Part EPC identifier is designed for use by the technical industries (including the
 * automotive sector) for the unique identification of parts or components.
 *
 * Typical use: Technical industries (e.g. automotive ) - components and parts
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cpi96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Cpi96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.CPI96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setPartReference(parseInt(data[2]));
                result.setSerial(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegment(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getCpi();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getCpi() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let asset = super.getSegment(partition.b);
        return companyPrefix + asset;
    }
    setCpi(cpi) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(cpi.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(cpi.substring(partition.a.digits, tmp)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getPartReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setPartReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(value, _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Cpi96 = Cpi96;
_a = Cpi96;
Cpi96.EPC_HEADER = 0x3C;
Cpi96.TOTAL_BITS = 96;
Cpi96.PARTITION_OFFSET = 11;
Cpi96.PARTITION_END = 14;
Cpi96.SERIAL_OFFSET = 65;
Cpi96.SERIAL_END = _a.TOTAL_BITS;
Cpi96.SERIAL_BITS = 31;
Cpi96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS);
Cpi96.TAG_URI = 'cpi-96';
// F.C.P.S (Filter, Company, Part, Serial)
Cpi96.TAG_URI_TEMPLATE = (filter, company, part, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${part}.${serial}`; };
// C.P.S   (Company, Part, Serial)
Cpi96.PID_URI_TEMPLATE = (company, part, serial) => { return `urn:epc:id:cpi:${company}.${part}.${serial}`; };
// Partition table columns: Company prefix, Item Reference
Cpi96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 11, 3), // 0 40 12 11 3
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 14, 4), // 1 37 11 14 4
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 17, 5), // 2 34 10 17 5 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 21, 6), // 3 30 09 21 6 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 24, 7), // 4 27 08 24 7 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 27, 8), // 5 24 07 27 8 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 31, 9)]; // 6 20 06 31 9

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],2:[function(require,module,exports){
"use strict";
/*
* EPC Tag Data Standard
* 2024 Sergio S. - https://github.com/sergiss/epc-tds
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epc = void 0;
const bit_array_1 = require("./utils/bit-array");
/**
 * Represents an EPC (Electronic Product Code) of the EPC Tag Data Standard.
 */
class Epc extends bit_array_1.BitArray {
    /**
     * Creates an instance of Epc.
     * @param length The total number of bits of the EPC.
     */
    constructor(length) {
        super(length);
    }
    /**
     * The filter value is additional control information that may be included in
     * the EPC memory bank of a Gen 2 tag. The intended use of the filter value is
     * to allow an RFID reader to select or deselect the tags corresponding to
     * certain physical objects, to make it easier to read the desired tags in an
     * environment where there may be other tags present in the environment
     * @return
     */
    getFilter() {
        return super.get(Epc.FILTER_OFFSET, Epc.FILTER_END);
    }
    /**
     * 0.- All Others (see Section 10.1).
     * 1.- Point of Sale (POS) Trade Item .
     * 2.- Full Case for Transport.
     * 3.- Reserved (see Section 10.1).
     * 4.- Inner Pack Trade Item Grouping for Handling.
     * 5.- Reserved (see Section 10.1).
     * 6.- Unit Load.
     * 7.- Unit inside Trade Item or component inside a
     *     product not intended for individual sale.
     * @param value
     */
    setFilter(value) {
        if (value < 0 || value > Epc.FILTER_MAX_VALUE) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${Epc.FILTER_MAX_VALUE})`);
        }
        super.set(value, Epc.FILTER_OFFSET, Epc.FILTER_END);
        return this;
    }
    /**
     * Get the value of a segment as BigInt
     * @param segment
     * @return
     */
    getSegmentBigInt(segment) {
        return super.getBigInt(segment.start, segment.end);
    }
    /**
     * Get the value of a segment
     * @param segment
     * @return
     */
    getSegment(segment) {
        return super.get(segment.start, segment.end);
    }
    /**
     * Set the value of a segment
     * @param value
     * @param segment
     */
    setSegment(value, segment) {
        if (value < 0 || value > segment.maxValue) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${segment.maxValue})`);
        }
        super.set(value, segment.start, segment.end);
    }
    /**
     * Return segment as string with leading zeros
     * @param {*} segment
     * @returns
     */
    getSegmentString(segment) {
        return String(this.getSegmentBigInt(segment)).padStart(segment.digits, '0');
    }
}
exports.Epc = Epc;
Epc.EPC_HEADER_OFFSET = 0;
Epc.EPC_HEADER_END = 8;
Epc.FILTER_OFFSET = 8;
Epc.FILTER_END = 11;
Epc.FILTER_MAX_VALUE = 7;

},{"./utils/bit-array":21}],3:[function(require,module,exports){
"use strict";
/**
 * 174-bit Global Document Type Identifier (GDTI)
 *
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to
 * a specific document, such as land registration papers, an insurance policy, and others.
 *
 * Typical use: Document
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gdti174 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gdti174 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GDTI174;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setDocumentReference(parseInt(data[2]));
                result.setSerial(data[3]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGdti();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGdti() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let document = super.getSegmentString(partition.b);
        let result = companyPrefix + document;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setGdti(gdti) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gdti.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(gdti.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(gdti.substring(tmp + 1, gdti.length));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getDocumentReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setDocumentReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.getString(_a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
    }
    setSerial(value) {
        if (!value || value.length > _a.MAX_SERIAL_LEN)
            throw new Error(`Value '${value}' length out of range (max length: ${_a.MAX_SERIAL_LEN})`);
        super.setString(value, _a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
        return this;
    }
}
exports.Gdti174 = Gdti174;
_a = Gdti174;
Gdti174.EPC_HEADER = 0x3E;
Gdti174.TOTAL_BITS = 174;
Gdti174.PARTITION_OFFSET = 11;
Gdti174.PARTITION_END = 14;
Gdti174.SERIAL_OFFSET = 55;
Gdti174.SERIAL_END = _a.TOTAL_BITS;
Gdti174.SERIAL_BITS = 119;
Gdti174.MAX_SERIAL_LEN = 17;
Gdti174.CHAR_BITS = (_a.SERIAL_END - _a.SERIAL_OFFSET) / _a.MAX_SERIAL_LEN; // 7
Gdti174.TAG_URI = "gdti-174";
// F.C.D.S (Filter, Company, Document, Serial)
Gdti174.TAG_URI_TEMPLATE = (filter, company, document, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${document}.${serial}`; };
// C.D.S   (Company, Document, Serial)
Gdti174.PID_URI_TEMPLATE = (company, document, serial) => { return `urn:epc:id:gdti:${company}.${document}.${serial}`; };
// Partition table columns: Company prefix, Item Reference
Gdti174.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 1, 0), // 0 40 12 01 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 4, 1), // 1 37 11 04 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 7, 2), // 2 34 10 07 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 11, 3), // 3 30 09 11 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 14, 4), // 4 27 08 14 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 17, 5), // 5 24 07 17 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 21, 6)]; // 6 20 06 21 6

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],4:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Document Type Identifier (GDTI)
 *
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to
 * a specific document, such as land registration papers, an insurance policy, and others.
 *
 * Typical use: Document
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gdti96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gdti96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GDTI96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setDocumentReference(parseInt(data[2]));
                result.setSerial(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGdti();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGdti() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let document = super.getSegmentString(partition.b);
        let result = companyPrefix + document;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setGdti(gdti) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gdti.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(gdti.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(Number(gdti.substring(tmp + 1, gdti.length)));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getDocumentReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setDocumentReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(value, _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Gdti96 = Gdti96;
_a = Gdti96;
Gdti96.EPC_HEADER = 0x2C;
Gdti96.TOTAL_BITS = 96;
Gdti96.PARTITION_OFFSET = 11;
Gdti96.PARTITION_END = 14;
Gdti96.SERIAL_OFFSET = 55;
Gdti96.SERIAL_END = _a.TOTAL_BITS;
Gdti96.SERIAL_BITS = 41;
Gdti96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS); // 2199023255551
Gdti96.TAG_URI = "gdti-96";
// F.C.D.S (Filter, Company, Document, Serial)
Gdti96.TAG_URI_TEMPLATE = (filter, company, document, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${document}.${serial}`; };
// C.D.S   (Company, Document, Serial)
Gdti96.PID_URI_TEMPLATE = (company, document, serial) => { return `urn:epc:id:gdti:${company}.${document}.${serial}`; };
// Partition table columns: Company prefix, Item Reference
Gdti96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 1, 0), // 0 40 12 01 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 4, 1), // 1 37 11 04 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 7, 2), // 2 34 10 07 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 11, 3), // 3 30 09 11 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 14, 4), // 4 27 08 14 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 17, 5), // 5 24 07 17 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 21, 6)]; // 6 20 06 21 6

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],5:[function(require,module,exports){
"use strict";
/**
 * 202-bit Global Individual Asset Identifier (GIAI)
 *
 * The Global Individual Asset Identifier EPC scheme is used to assign a unique identity to a specific
 * asset, such as a forklift or a computer.
 *
 * Typical use: Fixed asset
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giai202 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
class Giai202 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GIAI202;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setAssetReference(data[2]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        const partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getAssetReference());
    }
    toIdURI() {
        const partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getAssetReference());
    }
    toBarcode() {
        return this.getGiai();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGiai() {
        const partition = _a.PARTITIONS[this.getPartition()];
        const companyPrefix = super.getSegmentString(partition.a);
        const asset = super.getString(partition.b.start, partition.b.end, 7);
        return companyPrefix + asset;
    }
    setGiai(giai) {
        const partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(giai.substring(0, partition.a.digits)), partition.a);
        const tmp = partition.a.digits + partition.b.digits;
        super.setString(giai.substring(partition.a.digits, tmp), partition.b.start, partition.b.end, 7);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getAssetReference() {
        const segment = _a.PARTITIONS[this.getPartition()].b;
        return super.getString(segment.start, segment.end, 7);
    }
    setAssetReference(value) {
        const segment = _a.PARTITIONS[this.getPartition()].b;
        super.setString(value, segment.start, segment.end, 7);
        return this;
    }
}
exports.Giai202 = Giai202;
_a = Giai202;
Giai202.EPC_HEADER = 0x38;
Giai202.TOTAL_BITS = 202;
Giai202.PARTITION_OFFSET = 11;
Giai202.PARTITION_END = 14;
Giai202.TAG_URI = 'giai-202';
// F.C.A (Filter, Company, Asset)
Giai202.TAG_URI_TEMPLATE = (filter, company, asset) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${asset}`; };
// C.A (Company, Asset)
Giai202.PID_URI_TEMPLATE = (company, asset) => { return `urn:epc:id:giai:${company}.${asset}`; };
// Partition table columns: Company prefix, Asset Type
Giai202.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 148, 18), // 0 40 12 148 18
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 151, 19), // 1 37 11 151 19
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 154, 20), // 2 34 10 154 20 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 158, 21), // 3 30 09 158 21 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 161, 22), // 4 27 08 161 22 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 164, 23), // 5 24 07 164 23 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 168, 24)]; // 6 20 06 168 24

},{"../epc":2,"../partition":12,"../type":20}],6:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Individual Asset Identifier (GIAI)
 *
 * The Global Individual Asset Identifier EPC scheme is used to assign a unique identity to a specific
 * asset, such as a forklift or a computer.
 *
 * Typical use: Fixed asset
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giai96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
class Giai96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GIAI96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setAssetReference(BigInt(data[2]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        const partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentBigInt(partition.b));
    }
    toIdURI() {
        const partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentBigInt(partition.b));
    }
    toBarcode() {
        return this.getGiai();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGiai() {
        const partition = _a.PARTITIONS[this.getPartition()];
        const companyPrefix = super.getSegmentString(partition.a);
        const asset = super.getSegmentBigInt(partition.b);
        return companyPrefix + asset;
    }
    setGiai(giai) {
        const partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(giai.substring(0, partition.a.digits)), partition.a);
        const tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(giai.substring(partition.a.digits, tmp)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getAssetReference() {
        return super.getSegmentBigInt(_a.PARTITIONS[this.getPartition()].b);
    }
    setAssetReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
}
exports.Giai96 = Giai96;
_a = Giai96;
Giai96.EPC_HEADER = 0x34;
Giai96.TOTAL_BITS = 96;
Giai96.PARTITION_OFFSET = 11;
Giai96.PARTITION_END = 14;
Giai96.TAG_URI = 'giai-96';
// F.C.A (Filter, Company, Asset)
Giai96.TAG_URI_TEMPLATE = (filter, company, asset) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${asset}`; };
// C.A (Company, Asset)
Giai96.PID_URI_TEMPLATE = (company, asset) => { return `urn:epc:id:giai:${company}.${asset}`; };
// Partition table columns: Company prefix, Asset Type
Giai96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 42, 13), // 0 40 12 42 13
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 45, 14), // 1 37 11 45 14
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 48, 15), // 2 34 10 48 15 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 52, 16), // 3 30 09 52 16 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 55, 17), // 4 27 08 55 17 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 58, 18), // 5 24 07 58 18 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 62, 19)]; // 6 20 06 62 19

},{"../epc":2,"../partition":12,"../type":20}],7:[function(require,module,exports){
"use strict";
/**
 * 96-bit Serialised Global Trade Item Number (SGTIN)
 *
 * The General Identifier EPC scheme is independent of any specifications or identity scheme outside
 * the EPCglobal Tag Data Standard.
 *
 * Typical use: Unspecified
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gid96 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gid96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    toBarcode() {
        throw new Error('Unsupported method.');
    }
    getFilter() {
        throw new Error('Unsupported method.');
    }
    setFilter() {
        throw new Error('Unsupported method.');
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GID96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setManager(parseInt(data[0]));
                result.setClass(parseInt(data[1]));
                result.setSerial(parseInt(data[2]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        return _a.TAG_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
    }
    toIdURI() {
        return _a.PID_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getManager() {
        return super.get(_a.MANAGER_OFFSET, _a.MANAGER_END);
    }
    setManager(value) {
        if (value > _a.MAX_MANAGER)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_MANAGER})`);
        super.set(value, _a.MANAGER_OFFSET, _a.MANAGER_END);
        return this;
    }
    getClass() {
        return super.get(_a.CLASS_OFFSET, _a.CLASS_END);
    }
    setClass(value) {
        if (value > _a.MAX_CLASS)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_CLASS})`);
        super.set(value, _a.CLASS_OFFSET, _a.CLASS_END);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(value, _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Gid96 = Gid96;
_a = Gid96;
Gid96.EPC_HEADER = 0x35;
Gid96.TOTAL_BITS = 96;
Gid96.MANAGER_OFFSET = 8;
Gid96.MANAGER_END = 36;
Gid96.MANAGER_BITS = 28;
Gid96.MAX_MANAGER = utils_1.default.getMaxValue(_a.MANAGER_BITS);
Gid96.CLASS_OFFSET = 36;
Gid96.CLASS_END = 60;
Gid96.CLASS_BITS = 24;
Gid96.MAX_CLASS = utils_1.default.getMaxValue(_a.CLASS_BITS);
Gid96.SERIAL_OFFSET = 60;
Gid96.SERIAL_END = _a.TOTAL_BITS;
Gid96.SERIAL_BITS = 36;
Gid96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS);
Gid96.TAG_URI = 'gid-96';
// M.C.S (Manager, Class, Serial)
Gid96.TAG_URI_TEMPLATE = (manager, clazz, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${manager}.${clazz}.${serial}`; };
// M.C.S (Manager, Class, Serial)
Gid96.PID_URI_TEMPLATE = (manager, clazz, serial) => { return `urn:epc:id:gid:${manager}.${clazz}.${serial}`; };

},{"../epc":2,"../type":20,"../utils":22}],8:[function(require,module,exports){
"use strict";
/**
 * 170-bit Global Returnable Asset Identifier (GRAI)
 *
 * The Global Returnable Asset Identifier EPC scheme is used to assign a unique identity to a specific
 * returnable asset, such as a reusable shipping container or a pallet skid.
 *
 * Typical use: Returnable/reusable asset
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grai170 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const grai96_1 = require("./grai96");
const utils_1 = __importDefault(require("../utils"));
class Grai170 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GRAI170;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setAssetType(parseInt(data[2]));
                result.setSerial(data[3]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = grai96_1.Grai96.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = grai96_1.Grai96.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGrai();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= grai96_1.Grai96.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${grai96_1.Grai96.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGrai() {
        let partition = grai96_1.Grai96.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let assetType = super.getSegmentString(partition.b);
        let result = companyPrefix + assetType;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setGrai(grai) {
        let partition = grai96_1.Grai96.PARTITIONS[this.getPartition()];
        super.setSegment(Number(grai.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(grai.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(String(grai.substring(tmp + 1, grai.length)));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(grai96_1.Grai96.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, grai96_1.Grai96.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getAssetType() {
        return super.getSegment(grai96_1.Grai96.PARTITIONS[this.getPartition()].b);
    }
    setAssetType(value) {
        super.setSegment(value, grai96_1.Grai96.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.getString(_a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
    }
    /**
    * All values permitted by GS1 General Specifications (up to 16 alphanumeric characters)
    * @param value
    */
    setSerial(value) {
        if (!value || value.length > _a.MAX_SERIAL_LEN)
            throw new Error(`Value '${value}' length out of range (max length: ${_a.MAX_SERIAL_LEN})`);
        super.setString(value, _a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
        return this;
    }
}
exports.Grai170 = Grai170;
_a = Grai170;
Grai170.EPC_HEADER = 0x37;
Grai170.TOTAL_BITS = 170;
Grai170.PARTITION_OFFSET = 11;
Grai170.PARTITION_END = 14;
Grai170.SERIAL_OFFSET = 58;
Grai170.SERIAL_END = _a.TOTAL_BITS;
Grai170.SERIAL_BITS = 112;
Grai170.MAX_SERIAL_LEN = 16;
Grai170.CHAR_BITS = (_a.SERIAL_END - _a.SERIAL_OFFSET) / _a.MAX_SERIAL_LEN; // 7
Grai170.TAG_URI = 'grai-170';
// F.C.A.S (Filter, Company, AssetType, Serial)
Grai170.TAG_URI_TEMPLATE = (filter, company, asset, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${asset}.${serial}`; };
// C.A.S   (Company, AssetType, Serial)
Grai170.PID_URI_TEMPLATE = (company, asset, serial) => { return `urn:epc:id:grai:${company}.${asset}.${serial}`; };

},{"../epc":2,"../type":20,"../utils":22,"./grai96":9}],9:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Returnable Asset Identifier (GRAI)
 *
 * The Global Returnable Asset Identifier EPC scheme is used to assign a unique identity to a specific
 * returnable asset, such as a reusable shipping container or a pallet skid.
 *
 * Typical use: Returnable/reusable asset
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grai96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Grai96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GRAI96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setAssetType(parseInt(data[2]));
                result.setSerial(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGrai();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGrai() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let assetType = super.getSegmentString(partition.b);
        let result = companyPrefix + assetType;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setGrai(grai) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(grai.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(grai.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(Number(grai.substring(tmp + 1, grai.length)));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getAssetType() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setAssetType(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(value, _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Grai96 = Grai96;
_a = Grai96;
Grai96.EPC_HEADER = 0x33;
Grai96.TOTAL_BITS = 96;
Grai96.PARTITION_OFFSET = 11;
Grai96.PARTITION_END = 14;
Grai96.SERIAL_OFFSET = 58;
Grai96.SERIAL_END = _a.TOTAL_BITS;
Grai96.SERIAL_BITS = 38;
Grai96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS); // 274877906943
Grai96.TAG_URI = 'grai-96';
// F.C.A.S (Filter, Company, AssetType, Serial)
Grai96.TAG_URI_TEMPLATE = (filter, company, asset, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${asset}.${serial}`; };
// C.A.S   (Company, AssetType, Serial)
Grai96.PID_URI_TEMPLATE = (company, asset, serial) => { return `urn:epc:id:grai:${company}.${asset}.${serial}`; };
// Partition table columns: Company prefix, Asset Type
Grai96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 4, 0), // 0 40 12 04 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 7, 1), // 1 37 11 07 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 10, 2), // 2 34 10 10 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 14, 3), // 3 30 09 14 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 17, 4), // 4 27 08 17 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 20, 5), // 5 24 07 20 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 24, 6)]; // 6 20 06 24 6

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],10:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Individual Asset Identifier – Recipient (GSRN)
 *
 * The Global Service Relation Number EPC scheme is used to assign a unique identity to a service
 * recipient.
 *
 * Typical use: Hospital admission or club membership
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gsrn96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gsrn96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GSRN96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setServiceReference(parseInt(data[2]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b));
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegment(partition.b));
    }
    toBarcode() {
        return this.getGsrn();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGsrn() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let service = super.getSegmentString(partition.b);
        let result = companyPrefix + service;
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGsrn(gsrn) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gsrn.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(gsrn.substring(partition.a.digits, tmp)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getServiceReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setServiceReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
}
exports.Gsrn96 = Gsrn96;
_a = Gsrn96;
Gsrn96.EPC_HEADER = 0x2D;
Gsrn96.TOTAL_BITS = 96;
Gsrn96.PARTITION_OFFSET = 11;
Gsrn96.PARTITION_END = 14;
Gsrn96.TAG_URI = 'gsrn-96';
// F.C.S (Filter, Company, Service)
Gsrn96.TAG_URI_TEMPLATE = (filter, company, service) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${service}`; };
// C.S (Company, Service)
Gsrn96.PID_URI_TEMPLATE = (company, asset) => { return `urn:epc:id:gsrn:${company}.${asset}`; };
// Partition table columns: Company prefix, Service Reference
Gsrn96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 18, 5), // 0 40 12 18 5
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 21, 6), // 1 37 11 21 6
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 24, 7), // 2 34 10 24 7 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 28, 8), // 3 30 09 28 8 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 31, 9), // 4 27 08 31 9 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 34, 10), // 5 24 07 34 10 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 38, 11)]; // 6 20 06 38 11

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var epc_1 = require("./epc");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return epc_1.Epc; } });

},{"./epc":2}],12:[function(require,module,exports){
"use strict";
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partition = void 0;
const segment_1 = require("./segment");
/**
 * Represents a partition of the EPC Tag Data Standard.
 */
class Partition {
    /**
     * Creates an instance of Partition.
     * @param offset The starting bit position for the first segment.
     * @param bits1 The number of bits allocated to the first segment.
     * @param digits1 The number of digits that the first segment can represent.
     * @param bits2 The number of bits allocated to the second segment.
     * @param digits2 The number of digits that the second segment can represent.
     */
    constructor(offset, bits1, digits1, bits2, digits2) {
        this.a = new segment_1.Segment(offset, bits1, digits1);
        this.b = new segment_1.Segment(this.a.end, bits2, digits2);
    }
}
exports.Partition = Partition;

},{"./segment":13}],13:[function(require,module,exports){
"use strict";
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Segment = void 0;
/**
 * Represents a segment of the EPC Tag Data Standard.
 */
class Segment {
    /**
     * Creates an instance of Segment.
     * @param offset The initial offset of the segment.
     * @param bits The number of bits in the segment.
     * @param digits The number of digits the segment can represent.
     */
    constructor(offset, bits, digits) {
        this.start = offset;
        this.end = offset + bits;
        this.digits = digits;
        this.maxValue = Math.pow(10, digits) - 1; // Max value in n digits
    }
}
exports.Segment = Segment;

},{}],14:[function(require,module,exports){
"use strict";
/**
 * 96-bit Serialised Global Coupon Number (SGCN)
 *
 * The Global Coupon Number EPC scheme is used to assign a unique identity to a coupon.
 *
 * Typical use: Coupon
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sgcn96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Sgcn96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SGCN96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setCouponReference(parseInt(data[2]));
                result.setSerial(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getSgcn();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getSgcn() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let coupon = super.getSegmentString(partition.b);
        let result = companyPrefix + coupon;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setSgcn(sgcn) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(sgcn.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(sgcn.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(Number(sgcn.substring(tmp + 1, sgcn.length)));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getCouponReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setCouponReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END).toString().substring(1);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(Number('1' + value), _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Sgcn96 = Sgcn96;
_a = Sgcn96;
Sgcn96.EPC_HEADER = 0x3F;
Sgcn96.TOTAL_BITS = 96;
Sgcn96.PARTITION_OFFSET = 11;
Sgcn96.PARTITION_END = 14;
Sgcn96.SERIAL_OFFSET = 55;
Sgcn96.SERIAL_END = _a.TOTAL_BITS;
Sgcn96.SERIAL_BITS = 41;
Sgcn96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS);
Sgcn96.TAG_URI = "sgcn-96";
// F.C.C.S (Filter, Company, Coupon, Serial)
Sgcn96.TAG_URI_TEMPLATE = (filter, company, coupon, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${coupon}.${serial}`; };
// C.C.S   (Company, Coupon, Serial)
Sgcn96.PID_URI_TEMPLATE = (company, coupon, serial) => { return `urn:epc:id:sgcn:${company}.${coupon}.${serial}`; };
// Partition table columns: Company prefix, Item Reference
Sgcn96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 1, 0), // 0 40 12 01 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 4, 1), // 1 37 11 04 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 7, 2), // 2 34 10 07 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 11, 3), // 3 30 09 11 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 14, 4), // 4 27 08 14 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 17, 5), // 5 24 07 17 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 21, 6)]; // 6 20 06 21 6

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],15:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Location Number With or Without Extension (SGLN)
 *
 * The SGLN EPC scheme is used to assign a unique identity to a physical location, such as a specific
 * building or a specific unit of shelving within a warehouse.
 *
 * Typical use: Location
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sgln195 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const sgln96_1 = require("./sgln96");
const utils_1 = __importDefault(require("../utils"));
class Sgln195 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SGLN195;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompany(parseInt(data[1]));
                result.setLocation(parseInt(data[2]));
                result.setExtension(data[3]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
    }
    toIdURI() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
    }
    toBarcode() {
        return this.getGln();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= sgln96_1.Sgln96.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${sgln96_1.Sgln96.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGln() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        let result = this.getSegmentString(partition.a) + this.getSegmentString(partition.b);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGln(gln) {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gln.substring(0, partition.a.digits)), partition.a);
        super.setSegment(Number(gln.substring(partition.a.digits, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompany() {
        return super.getSegment(sgln96_1.Sgln96.PARTITIONS[this.getPartition()].a);
    }
    setCompany(value) {
        super.setSegment(value, sgln96_1.Sgln96.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getLocation() {
        return super.getSegment(sgln96_1.Sgln96.PARTITIONS[this.getPartition()].b);
    }
    setLocation(value) {
        super.setSegment(value, sgln96_1.Sgln96.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getExtension() {
        return super.getString(_a.EXTENSION_OFFSET, _a.EXTENSION_END, _a.CHAR_BITS);
    }
    /**
    * All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
    * @param value
    */
    setExtension(value) {
        if (!value || value.length > _a.MAX_EXTENSION_LEN)
            throw new Error(`Value '${value}' length out of range (max length: ${_a.MAX_EXTENSION_LEN})`);
        super.setString(value, _a.EXTENSION_OFFSET, _a.EXTENSION_END, _a.CHAR_BITS);
        return this;
    }
}
exports.Sgln195 = Sgln195;
_a = Sgln195;
Sgln195.EPC_HEADER = 0x39;
Sgln195.TOTAL_BITS = 195;
Sgln195.PARTITION_OFFSET = 11;
Sgln195.PARTITION_END = 14;
Sgln195.EXTENSION_OFFSET = 55;
Sgln195.EXTENSION_END = _a.TOTAL_BITS;
Sgln195.EXTENSION_BITS = 140;
Sgln195.MAX_EXTENSION_LEN = 20;
Sgln195.CHAR_BITS = (_a.EXTENSION_END - _a.EXTENSION_OFFSET) / _a.MAX_EXTENSION_LEN;
Sgln195.TAG_URI = 'sgln-195';
// F.C.L.E (Filter, Company, Location, Extension)
Sgln195.TAG_URI_TEMPLATE = (filter, company, location, extension) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${location}.${extension}`; };
// C.L.E   (Company, Location, Extension)
Sgln195.PID_URI_TEMPLATE = (company, location, extension) => { return `urn:epc:id:sgln:${company}.${location}.${extension}`; };

},{"../epc":2,"../type":20,"../utils":22,"./sgln96":16}],16:[function(require,module,exports){
"use strict";
/**
 * 96-bit Global Location Number With or Without Extension (SGLN)
 *
 * The SGLN EPC scheme is used to assign a unique identity to a physical location, such as a specific
 * building or a specific unit of shelving within a warehouse.
 *
 * Typical use: Location
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sgln96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Sgln96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SGLN96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompany(parseInt(data[1]));
                result.setLocation(parseInt(data[2]));
                result.setExtension(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
    }
    toBarcode() {
        return this.getGln();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGln() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let result = this.getSegmentString(partition.a) + this.getSegmentString(partition.b);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGln(gln) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gln.substring(0, partition.a.digits)), partition.a);
        super.setSegment(Number(gln.substring(partition.a.digits, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompany() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompany(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getLocation() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setLocation(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getExtension() {
        return super.get(_a.EXTENSION_OFFSET, _a.EXTENSION_END);
    }
    setExtension(value) {
        if (value > _a.MAX_EXTENSION)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_EXTENSION})`);
        super.set(value, _a.EXTENSION_OFFSET, _a.EXTENSION_END);
        return this;
    }
}
exports.Sgln96 = Sgln96;
_a = Sgln96;
Sgln96.EPC_HEADER = 0x32;
Sgln96.TOTAL_BITS = 96;
Sgln96.PARTITION_OFFSET = 11;
Sgln96.PARTITION_END = 14;
Sgln96.EXTENSION_OFFSET = 55;
Sgln96.EXTENSION_END = _a.TOTAL_BITS;
Sgln96.EXTENSION_BITS = 41;
Sgln96.MAX_EXTENSION = utils_1.default.getMaxValue(_a.EXTENSION_BITS); // 274877906943
Sgln96.TAG_URI = 'sgln-96';
// F.C.L.E (Filter, Company, Location, Extension)
Sgln96.TAG_URI_TEMPLATE = (filter, company, location, extension) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${location}.${extension}`; };
// C.L.E   (Company, Location, Extension)
Sgln96.PID_URI_TEMPLATE = (company, location, extension) => { return `urn:epc:id:sgln:${company}.${location}.${extension}`; };
// Partition table columns: Company prefix, Location Reference
Sgln96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 1, 0), // 0 40 12 01 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 4, 1), // 1 37 11 04 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 7, 2), // 2 34 10 07 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 11, 3), // 3 30 09 11 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 14, 4), // 4 27 08 14 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 17, 5), // 5 24 07 17 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 21, 6)]; // 6 20 06 21 6

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],17:[function(require,module,exports){
"use strict";
/**
 * 198-bit Serialised Global Trade Item Number (SGTIN)
 *
 * The Serialised Global Trade Item Number EPC scheme is used to assign a unique identity to an
 * instance of a trade item, such as a specific instance of a product or SKU.
 *
 * Typical use: Trade item
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sgtin198 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const sgtin96_1 = require("./sgtin96");
const utils_1 = __importDefault(require("../utils"));
class Sgtin198 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SGTIN198;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setItemReference(parseInt(data[2]));
                result.setSerial(data[3]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGtin();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= sgtin96_1.Sgtin96.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${sgtin96_1.Sgtin96.PARTITIONS.length - 1})`);
        }
        super.set(value, sgtin96_1.Sgtin96.PARTITION_OFFSET, sgtin96_1.Sgtin96.PARTITION_END);
        return this;
    }
    getGtin() {
        let partition = sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()];
        let item = super.getSegmentString(partition.b);
        let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGtin(gtin) {
        let partition = sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gtin.substring(1, partition.a.digits + 1)), partition.a);
        super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getItemReference() {
        return super.getSegment(sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()].b);
    }
    setItemReference(value) {
        super.setSegment(value, sgtin96_1.Sgtin96.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.getString(_a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
    }
    /**
    * All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
    * @param value
    */
    setSerial(value) {
        if (!value || value.length > _a.MAX_SERIAL_LEN)
            throw new Error(`Value '${value}' length out of range (max length: ${_a.MAX_SERIAL_LEN})`);
        super.setString(value, _a.SERIAL_OFFSET, _a.SERIAL_END, _a.CHAR_BITS);
        return this;
    }
}
exports.Sgtin198 = Sgtin198;
_a = Sgtin198;
Sgtin198.EPC_HEADER = 0x36;
Sgtin198.TOTAL_BITS = 198;
Sgtin198.PARTITION_OFFSET = 11;
Sgtin198.PARTITION_END = 14;
Sgtin198.SERIAL_OFFSET = 58;
Sgtin198.SERIAL_END = _a.TOTAL_BITS;
Sgtin198.MAX_SERIAL_LEN = 20;
Sgtin198.CHAR_BITS = (_a.SERIAL_END - _a.SERIAL_OFFSET) / _a.MAX_SERIAL_LEN; // 7
Sgtin198.TAG_URI = 'sgtin-198';
// F.C.I.S (Filter, Company, Item, Serial)
Sgtin198.TAG_URI_TEMPLATE = (filter, company, item, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${item}.${serial}`; };
// C.I.S   (Company, Item, Serial)
Sgtin198.PID_URI_TEMPLATE = (company, item, serial) => { return `urn:epc:id:sgtin:${company}.${item}.${serial}`; };

},{"../epc":2,"../type":20,"../utils":22,"./sgtin96":18}],18:[function(require,module,exports){
"use strict";
/**
 * 96-bit Serialised Global Trade Item Number (SGTIN)
 *
 * The Serialised Global Trade Item Number EPC scheme is used to assign a unique identity to an
 * instance of a trade item, such as a specific instance of a product or SKU.
 *
 * Typical use: Trade item
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sgtin96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Sgtin96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SGTIN96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setItemReference(parseInt(data[2]));
                result.setSerial(parseInt(data[3]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getSerial());
    }
    toBarcode() {
        return this.getGtin();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGtin() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let item = super.getSegmentString(partition.b);
        let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGtin(gtin) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gtin.substring(1, partition.a.digits + 1)), partition.a);
        super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getItemReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setItemReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getSerial() {
        return super.get(_a.SERIAL_OFFSET, _a.SERIAL_END);
    }
    setSerial(value) {
        if (value > _a.MAX_SERIAL)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_SERIAL})`);
        super.set(value, _a.SERIAL_OFFSET, _a.SERIAL_END);
        return this;
    }
}
exports.Sgtin96 = Sgtin96;
_a = Sgtin96;
Sgtin96.EPC_HEADER = 0x30;
Sgtin96.TOTAL_BITS = 96;
Sgtin96.PARTITION_OFFSET = 11;
Sgtin96.PARTITION_END = 14;
Sgtin96.SERIAL_OFFSET = 58;
Sgtin96.SERIAL_END = _a.TOTAL_BITS;
Sgtin96.SERIAL_BITS = 38;
Sgtin96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS); // 274877906943
Sgtin96.TAG_URI = 'sgtin-96';
// F.C.I.S (Filter, Company, Item, Serial)
Sgtin96.TAG_URI_TEMPLATE = (filter, company, item, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${item}.${serial}`; };
// C.I.S   (Company, Item, Serial)
Sgtin96.PID_URI_TEMPLATE = (company, item, serial) => { return `urn:epc:id:sgtin:${company}.${item}.${serial}`; };
// Partition table columns: Company prefix, Item Reference
Sgtin96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 4, 1), // 0 40 12 04 1
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 7, 2), // 1 37 11 07 2
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 10, 3), // 2 34 10 10 3 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 14, 4), // 3 30 09 14 4 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 17, 5), // 4 27 08 17 5 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 20, 6), // 5 24 07 20 6 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 24, 7)]; // 6 20 06 24 7

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],19:[function(require,module,exports){
"use strict";
/**
 * 96-bit Serial Shipping Container Code (SSCC)
 *
 * The Serial Shipping Container Code EPC scheme is used to assign a unique identity to a logistics
 * handling unit, such as the aggregate contents of a shipping container or a pallet load.
 *
 * Typical use: Pallet load or other logistics unit load
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sscc96 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const partition_1 = require("../partition");
const utils_1 = __importDefault(require("../utils"));
class Sscc96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.SSCC96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setFilter(parseInt(data[0]));
                result.setPartition(12 - data[1].length);
                result.setCompanyPrefix(parseInt(data[1]));
                result.setSerialReference(parseInt(data[2]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b));
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegmentString(partition.b));
    }
    toBarcode() {
        return this.getSscc();
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getPartition() {
        return super.get(_a.PARTITION_OFFSET, _a.PARTITION_END);
    }
    setPartition(value) {
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getSscc() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let item = super.getSegmentString(partition.b);
        let result = item.substring(0, 1) + super.getSegmentString(partition.a) + item.substring(1);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setSscc(gtin) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gtin.substring(1, partition.a.digits + 1)), partition.a);
        super.setSegment(Number(gtin.charAt(0) + gtin.substring(partition.a.digits + 1, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getSerialReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setSerialReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getMaxSerialReference() {
        return _a.PARTITIONS[this.getPartition()].b.maxValue;
    }
}
exports.Sscc96 = Sscc96;
_a = Sscc96;
Sscc96.EPC_HEADER = 0x31;
Sscc96.TOTAL_BITS = 96;
Sscc96.PARTITION_OFFSET = 11;
Sscc96.PARTITION_END = 14;
Sscc96.TAG_URI = 'sscc-96';
// F.C.S (Filter, Company, Serial)
Sscc96.TAG_URI_TEMPLATE = (filter, company, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${serial}`; };
// C.S   (Company, Serial)
Sscc96.PID_URI_TEMPLATE = (company, serial) => { return `urn:epc:id:sscc:${company}.${serial}`; };
// Partition table columns: Company prefix, Serial Reference
Sscc96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 18, 5), // 0 40 12 18 05
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 21, 6), // 1 37 11 21 06
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 24, 7), // 2 34 10 24 07 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 28, 8), // 3 30 09 28 08 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 31, 9), // 4 27 08 31 09 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 34, 10), // 5 24 07 34 10 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 38, 11)]; // 6 20 06 38 11

},{"../epc":2,"../partition":12,"../type":20,"../utils":22}],20:[function(require,module,exports){
"use strict";
/*
* EPC Tag Data Standard
* 2024 Sergio S. - https://github.com/sergiss/epc-tds
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
var Type;
(function (Type) {
    Type["CPI96"] = "CPI-96";
    Type["SGTIN96"] = "SGTIN-96";
    Type["SGTIN198"] = "SGTIN-198";
    Type["SSCC96"] = "SSCC-96";
    Type["SGLN96"] = "SGLN-96";
    Type["SGLN195"] = "SGLN-195";
    Type["GRAI96"] = "GRAI-96";
    Type["GRAI170"] = "GRAI-170";
    Type["GID96"] = "GID-96";
    Type["GIAI96"] = "GIAI-96";
    Type["GIAI202"] = "GIAI-202";
    Type["GSRN96"] = "GSRN-96";
    Type["GPI96"] = "GPI-96";
    Type["GDTI96"] = "GDTI-96";
    Type["GDTI174"] = "GDTI-174";
    Type["SGCN96"] = "SGCN-96";
})(Type || (exports.Type = Type = {}));

},{}],21:[function(require,module,exports){
"use strict";
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitArray = void 0;
class BitArray {
    constructor(length) {
        this.length = (length + 7) >> 3;
        this.data = [];
    }
    /**
     * Set selected bit
     * @param index
     */
    setBit(index) {
        this.data[index >> 3] |= 1 << (index & 7);
    }
    /**
     * Clear selected bit
     * @param index
     */
    clearBit(index) {
        this.data[index >> 3] &= ~(1 << (index & 7));
    }
    /**
     * Check if selected bit is set
     * @param offset
     * @return
     */
    isBit(index) {
        return (this.data[index >> 3] >> (index & 7)) & 0b1;
    }
    /**
     * Clear data of bit array.
     */
    clear() {
        for (let i = 0; i < this.length; i++) {
            this.data[i] = 0;
        }
    }
    set(value, startIndex, endIndex) {
        let v = BigInt(value);
        for (let i = BigInt(0); startIndex < endIndex; i++) {
            endIndex--;
            if ((v >> i) & BigInt(1)) {
                // check bit
                this.setBit(endIndex);
            }
            else {
                this.clearBit(endIndex);
            }
        }
    }
    getBigInt(startIndex, endIndex) {
        let result = BigInt(0);
        for (let i = BigInt(0); startIndex < endIndex; i++) {
            if (this.isBit(--endIndex)) {
                result |= BigInt(1) << i; // set bit
            }
        }
        return result;
    }
    get(startIndex, endIndex) {
        return Number(this.getBigInt(startIndex, endIndex));
    }
    getSigned(startIndex, endIndex) {
        let i, result = BigInt(0);
        for (i = BigInt(0); startIndex < endIndex; i++) {
            if (this.isBit(--endIndex)) {
                result |= BigInt(1) << i; // set bit
            }
        }
        let mask = BigInt(1) << (i - BigInt(1));
        if (result & mask) {
            // check first bit
            result = (mask ^ result) - mask;
        }
        return Number(result);
    }
    setString(value, startIndex, endIndex, charBits) {
        for (let i = 0; i < value.length &&
            (charBits = Math.min(charBits, endIndex - startIndex)) > 0; ++i) {
            // iterate bytes
            this.set(value.charCodeAt(i), startIndex, (startIndex += charBits));
        }
        for (; startIndex < endIndex; ++startIndex) {
            // clear remaining bits
            this.clearBit(startIndex);
        }
    }
    /**
     * Return string from bit array
     * @param startIndex offset
     * @param endIndex last bit
     * @param charBits how many bits has stored in a byte (max 8 bits)
     * @return
     */
    getString(startIndex, endIndex, charBits) {
        let b, result = "";
        for (let i = 0; (charBits = Math.min(charBits, endIndex - startIndex)) > 0; ++i) {
            // iterate bytes
            if ((b = this.get(startIndex, (startIndex += charBits)))) {
                result += String.fromCharCode(b);
            }
        }
        return result;
    }
    /**
     * Return a hexadecimal string representation of the bit array.
     * @return hexadecimal base 16
     */
    toHexString() {
        let b, result = "";
        for (let i = 0; i < this.length; ++i) {
            b = this.data[i]; // iterate bytes
            result +=
                BitArray.REVERSE_HEX_CHARS[b & 0xf] +
                    BitArray.REVERSE_HEX_CHARS[(b & 0xf0) >> 4];
        }
        return result;
    }
    /**
     * Return a binary string representation of the bit array.
     * @return binary base 2
     */
    toBitString() {
        let b, result = "";
        for (let i = 0; i < this.length; ++i) {
            b = this.data[i]; // iterate bytes
            for (let j = 0; j < 8; ++j) {
                result += (b >>> j) & 0b1 ? "1" : "0";
            }
        }
        return result;
    }
    setFromBitArray(bitArray) {
        this.data = [...bitArray.data];
        return this;
    }
    setFromHexString(hex) {
        if (hex.length & 0b1) {
            // odd check
            hex = "0" + hex; // even hex
        }
        this.data = new Array(hex.length >> 1);
        for (let j = 0, i = 0; i < this.length; i++, j += 2) {
            this.data[i] =
                BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j)] |
                    (BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j + 1)] << 4);
        }
        return this;
    }
    not() {
        let result = new BitArray(this.length << 3);
        for (let i = 0; i < result.data.length; ++i) {
            result.data[i] = ~this.data[i];
        }
        return result;
    }
    or(bitArray) {
        let result;
        if (bitArray.length > this.length) {
            result = new BitArray(bitArray.data.length << 3);
        }
        else {
            result = new BitArray(this.length << 3);
        }
        for (let i = 0; i < result.data.length; ++i) {
            result.data[i] = bitArray.data[i] | this.data[i];
        }
        return result;
    }
    xor(bitArray) {
        let result;
        if (bitArray.length > this.length) {
            result = new BitArray(bitArray.data.length << 3);
        }
        else {
            result = new BitArray(this.length << 3);
        }
        for (let i = 0; i < result.data.length; ++i) {
            result.data[i] = bitArray.data[i] ^ this.data[i];
        }
        return result;
    }
    and(bitArray) {
        let result;
        if (bitArray.length > this.length) {
            result = new BitArray(bitArray.data.length << 3);
        }
        else {
            result = new BitArray(this.length << 3);
        }
        for (let i = 0; i < result.data.length; ++i) {
            result.data[i] = bitArray.data[i] & this.data[i];
        }
        return result;
    }
}
exports.BitArray = BitArray;
BitArray.REVERSE_HEX_CHARS = ['0', '8', '4', 'C', '2', 'A', '6', 'E', '1', '9', '5', 'D', '3', 'B', '7', 'F'];
BitArray.REVERSE_DEC_TABLE = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, 0, 8, 4, 12, 2, 10, 6, 14, 1, 9, -1, -1, -1, -1,
    -1, -1, -1, 5, 13, 3, 11, 7, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 13, 3, 11, 7, 15, -1];

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var utils_1 = require("./utils");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return utils_1.Utils; } });

},{"./utils":23}],23:[function(require,module,exports){
"use strict";
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const HEX_TABLE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const DEC_TABLE = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8,
    9, -1, -1, -1, -1, -1, -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];
const NUMBER_TABLE = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 00 - 09
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 10 - 19
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 20 - 29
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 30 - 39
    -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, // 40 - 49
    2, 3, 4, 5, 6, 7, 8, 9, -1, -1 // 50 - 59
];
/**
 * Compute the check digit of a barcode.
 * @param barcode The barcode to compute the check digit.
 * @returns computed check digit
 */
const computeCheckDigit = (barcode) => {
    // CHECK DIGIT										
    // GTIN-8                                          n01 n02 n03 n04 n05 n06 n07 | n08 
    // GTIN-12                         n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 | n12 
    // GTIN-13                     n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 | n13 
    // GTIN-14                 n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 | n14 
    // GSIN        n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 | n17
    // SSCC    n01 n02 n03 n04 n05 n06 n07 n08 n09 n10 n11 n12 n13 n14 n15 n16 n17 | n18
    // ----------------------------------------------------------------------------------------
    // Mult     x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3  x1  x3
    let odd, even = 0;
    let i = barcode.length - 1;
    if (i & 0b1) {
        // even check
        odd = 0;
    }
    else {
        odd = NUMBER_TABLE[barcode.charCodeAt(0)];
    }
    // Multiply value of each position by x3, x1 and add results together to create sum
    for (; i > 0; i -= 2) {
        odd += NUMBER_TABLE[barcode.charCodeAt(i)];
        even += NUMBER_TABLE[barcode.charCodeAt(i - 1)];
    }
    // Subtract the sum from nearest equal or higher multiple of ten
    let result = (even + odd * 3) % 10;
    if (result !== 0) {
        result = 10 - result;
    }
    return result;
};
/**
 * Get the maximum value that can be represented with the given number of bits.
 * @param bits number of bits
 * @returns the maximum value
 */
const getMaxValue = (bits) => {
    return Math.pow(2, bits) - 1;
};
/**
 * Convert a hex string to a byte.
 * @param hex
 * @param offset
 * @returns
 */
const hexToByte = (hex, offset) => {
    return ((DEC_TABLE[hex.charCodeAt(offset)] << 4) |
        DEC_TABLE[hex.charCodeAt(offset + 1)]);
};
/**
 * Generate a random EAN string.
 * @param n The length of the string.
 * @returns The random EAN string.
 */
const randomEan = (n) => {
    let result = "";
    for (let i = 1; i < n; ++i) {
        result += Math.floor(Math.random() * 10);
    }
    return result + computeCheckDigit(result);
};
/**
 * Generate a random hexadecimal string.
 * @param len The length of the string.
 * @returns The random hexadecimal string.
 */
const randomHex = (len) => {
    let result = "";
    for (let i = 0; i < len; ++i) {
        result += HEX_TABLE[Math.floor(Math.random() * HEX_TABLE.length)];
    }
    return result;
};
exports.Utils = {
    computeCheckDigit,
    getMaxValue,
    hexToByte,
    randomEan,
    randomHex,
};

},{}],"epc-tds":[function(require,module,exports){
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sscc96_1 = require("./epc/sscc/sscc96");
const sgtin96_1 = require("./epc/sgtin/sgtin96");
const sgtin198_1 = require("./epc/sgtin/sgtin198");
const sgln96_1 = require("./epc/sgln/sgln96");
const sgln195_1 = require("./epc/sgln/sgln195");
const gsrn96_1 = require("./epc/gsrn/gsrn96");
const sgcn96_1 = require("./epc/sgcn/sgcn96");
const grai96_1 = require("./epc/grai/grai96");
const grai170_1 = require("./epc/grai/grai170");
const gid96_1 = require("./epc/gid/gid96");
const giai96_1 = require("./epc/giai/giai96");
const giai202_1 = require("./epc/giai/giai202");
const cpi96_1 = require("./epc/cpi/cpi96");
const gdti96_1 = require("./epc/gdti/gdti96");
const gdti174_1 = require("./epc/gdti/gdti174");
const epc_1 = __importDefault(require("./epc"));
const utils_1 = __importDefault(require("./epc/utils"));
function fromTagURI(uri) {
    const value = uri.split(':');
    switch (value[3]) {
        case sgtin96_1.Sgtin96.TAG_URI:
            return sgtin96_1.Sgtin96.fromTagURI(uri);
        case sgtin198_1.Sgtin198.TAG_URI:
            return sgtin198_1.Sgtin198.fromTagURI(uri);
        case grai96_1.Grai96.TAG_URI:
            return grai96_1.Grai96.fromTagURI(uri);
        case grai170_1.Grai170.TAG_URI:
            return grai170_1.Grai170.fromTagURI(uri);
        case sscc96_1.Sscc96.TAG_URI:
            return sscc96_1.Sscc96.fromTagURI(uri);
        case sgln96_1.Sgln96.TAG_URI:
            return sgln96_1.Sgln96.fromTagURI(uri);
        case sgln195_1.Sgln195.TAG_URI:
            return sgln195_1.Sgln195.fromTagURI(uri);
        case gid96_1.Gid96.TAG_URI:
            return gid96_1.Gid96.fromTagURI(uri);
        case giai96_1.Giai96.TAG_URI:
            return giai96_1.Giai96.fromTagURI(uri);
        case giai202_1.Giai202.TAG_URI:
            return giai202_1.Giai202.fromTagURI(uri);
        case gsrn96_1.Gsrn96.TAG_URI:
            return gsrn96_1.Gsrn96.fromTagURI(uri);
        case cpi96_1.Cpi96.TAG_URI:
            return cpi96_1.Cpi96.fromTagURI(uri);
        case gdti96_1.Gdti96.TAG_URI:
            return gdti96_1.Gdti96.fromTagURI(uri);
        case gdti174_1.Gdti174.TAG_URI:
            return gdti174_1.Gdti174.fromTagURI(uri);
        case sgcn96_1.Sgcn96.TAG_URI:
            return sgcn96_1.Sgcn96.fromTagURI(uri);
        default:
            throw new Error(`Unsupported Tag URI: '${uri}'`);
    }
}
function valueOf(hexEpc) {
    let header = utils_1.default.hexToByte(hexEpc, 0); // first byte of EPC
    switch (header) {
        case grai96_1.Grai96.EPC_HEADER:
            return new grai96_1.Grai96(hexEpc);
        case grai170_1.Grai170.EPC_HEADER:
            return new grai170_1.Grai170(hexEpc);
        case sscc96_1.Sscc96.EPC_HEADER:
            return new sscc96_1.Sscc96(hexEpc);
        case sgln96_1.Sgln96.EPC_HEADER:
            return new sgln96_1.Sgln96(hexEpc);
        case sgln195_1.Sgln195.EPC_HEADER:
            return new sgln195_1.Sgln195(hexEpc);
        case sgtin96_1.Sgtin96.EPC_HEADER:
            return new sgtin96_1.Sgtin96(hexEpc);
        case sgtin198_1.Sgtin198.EPC_HEADER:
            return new sgtin198_1.Sgtin198(hexEpc);
        case gid96_1.Gid96.EPC_HEADER:
            return new gid96_1.Gid96(hexEpc);
        case giai96_1.Giai96.EPC_HEADER:
            return new giai96_1.Giai96(hexEpc);
        case giai202_1.Giai202.EPC_HEADER:
            return new giai202_1.Giai202(hexEpc);
        case gsrn96_1.Gsrn96.EPC_HEADER:
            return new gsrn96_1.Gsrn96(hexEpc);
        case cpi96_1.Cpi96.EPC_HEADER:
            return new cpi96_1.Cpi96(hexEpc);
        case gdti96_1.Gdti96.EPC_HEADER:
            return new gdti96_1.Gdti96(hexEpc);
        case gdti174_1.Gdti174.EPC_HEADER:
            return new gdti174_1.Gdti174(hexEpc);
        case sgcn96_1.Sgcn96.EPC_HEADER:
            return new sgcn96_1.Sgcn96(hexEpc);
        default:
            throw new Error(`Unsupported EPC: '${hexEpc}'`);
    }
}
const TDS = {
    fromTagURI, valueOf, Utils: utils_1.default,
    Sscc96: sscc96_1.Sscc96, Sgtin96: sgtin96_1.Sgtin96, Sgtin198: sgtin198_1.Sgtin198, Sgln96: sgln96_1.Sgln96, Sgln195: sgln195_1.Sgln195, Gsrn96: gsrn96_1.Gsrn96, Sgcn96: sgcn96_1.Sgcn96, Grai96: grai96_1.Grai96, Grai170: grai170_1.Grai170, Gid96: gid96_1.Gid96, Giai96: giai96_1.Giai96, Giai202: giai202_1.Giai202, Cpi96: cpi96_1.Cpi96, Gdti96: gdti96_1.Gdti96, Gdti174: gdti174_1.Gdti174, Epc: epc_1.default
};
exports.default = TDS;
module.exports = TDS;

},{"./epc":11,"./epc/cpi/cpi96":1,"./epc/gdti/gdti174":3,"./epc/gdti/gdti96":4,"./epc/giai/giai202":5,"./epc/giai/giai96":6,"./epc/gid/gid96":7,"./epc/grai/grai170":8,"./epc/grai/grai96":9,"./epc/gsrn/gsrn96":10,"./epc/sgcn/sgcn96":14,"./epc/sgln/sgln195":15,"./epc/sgln/sgln96":16,"./epc/sgtin/sgtin198":17,"./epc/sgtin/sgtin96":18,"./epc/sscc/sscc96":19,"./epc/utils":22}]},{},[]);
