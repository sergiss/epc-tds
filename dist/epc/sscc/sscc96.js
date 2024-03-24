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
Sscc96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 18, 5),
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 21, 6),
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 24, 7),
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 28, 8),
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 31, 9),
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 34, 10),
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 38, 11)]; // 6 20 06 38 11
