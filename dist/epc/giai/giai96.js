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
Giai96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 42, 13),
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 45, 14),
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 48, 15),
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 52, 16),
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 55, 17),
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 58, 18),
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 62, 19)]; // 6 20 06 62 19
