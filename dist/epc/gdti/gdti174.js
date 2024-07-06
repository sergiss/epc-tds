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
