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
