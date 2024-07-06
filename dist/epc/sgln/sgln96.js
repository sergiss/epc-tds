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
