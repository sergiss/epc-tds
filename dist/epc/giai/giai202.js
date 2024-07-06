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
