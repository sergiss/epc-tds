"use strict";
/**
 * 96-bit Global Returnable Asset Identifier (GRAI)
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
exports.Grai96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Grai96 extends epc_1.Epc {
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
        return type_1.Type.GRAI96;
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
        if (value < 0 || value >= _a.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGrai() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let assetType = super.getSegmentString(partition.b);
        let result = companyPrefix + assetType;
        return result + utils_1.default.computeCheckDigit(result) + this.getSerial();
    }
    setGrai(grai) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(grai.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(grai.substring(partition.a.digits, tmp)), partition.b);
        this.setSerial(Number(grai.substring(tmp + 1, grai.length)));
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getAssetType() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setAssetType(value) {
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
exports.Grai96 = Grai96;
_a = Grai96;
Grai96.EPC_HEADER = 0x33;
Grai96.TOTAL_BITS = 96;
Grai96.PARTITION_OFFSET = 11;
Grai96.PARTITION_END = 14;
Grai96.SERIAL_OFFSET = 58;
Grai96.SERIAL_END = _a.TOTAL_BITS;
Grai96.SERIAL_BITS = 38;
Grai96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS); // 274877906943
Grai96.TAG_URI = 'grai-96';
// F.C.A.S (Filter, Company, AssetType, Serial)
Grai96.TAG_URI_TEMPLATE = (filter, company, asset, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${asset}.${serial}`; };
// C.A.S   (Company, AssetType, Serial)
Grai96.PID_URI_TEMPLATE = (company, asset, serial) => { return `urn:epc:id:grai:${company}.${asset}.${serial}`; };
// Partition table columns: Company prefix, Asset Type
Grai96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 4, 0), // 0 40 12 04 0
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 7, 1), // 1 37 11 07 1
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 10, 2), // 2 34 10 10 2 
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 14, 3), // 3 30 09 14 3 
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 17, 4), // 4 27 08 17 4 
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 20, 5), // 5 24 07 20 5 
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 24, 6)]; // 6 20 06 24 6
