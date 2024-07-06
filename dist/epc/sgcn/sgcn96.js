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
