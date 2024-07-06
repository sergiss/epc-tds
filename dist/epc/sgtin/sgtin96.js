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
