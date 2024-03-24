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
