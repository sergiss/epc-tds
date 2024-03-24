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
Cpi96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 11, 3),
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 14, 4),
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 17, 5),
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 21, 6),
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 24, 7),
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 27, 8),
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 31, 9)]; // 6 20 06 31 9
