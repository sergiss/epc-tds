"use strict";
/**
 * 96-bit Global Individual Asset Identifier – Recipient (GSRN)
 *
 * The Global Service Relation Number EPC scheme is used to assign a unique identity to a service
 * recipient.
 *
 * Typical use: Hospital admission or club membership
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gsrn96 = void 0;
const epc_1 = require("../epc");
const partition_1 = require("../partition");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gsrn96 extends epc_1.Epc {
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
        return type_1.Type.GSRN96;
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
                result.setServiceReference(parseInt(data[2]));
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
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegment(partition.b));
    }
    toIdURI() {
        let partition = _a.PARTITIONS[this.getPartition()];
        return _a.PID_URI_TEMPLATE(this.getSegmentString(partition.a), this.getSegment(partition.b));
    }
    toBarcode() {
        return this.getGsrn();
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
    getGsrn() {
        let partition = _a.PARTITIONS[this.getPartition()];
        let companyPrefix = super.getSegmentString(partition.a);
        let service = super.getSegmentString(partition.b);
        let result = companyPrefix + service;
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGsrn(gsrn) {
        let partition = _a.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gsrn.substring(0, partition.a.digits)), partition.a);
        let tmp = partition.a.digits + partition.b.digits;
        super.setSegment(Number(gsrn.substring(partition.a.digits, tmp)), partition.b);
        return this;
    }
    getCompanyPrefix() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].a);
    }
    setCompanyPrefix(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getServiceReference() {
        return super.getSegment(_a.PARTITIONS[this.getPartition()].b);
    }
    setServiceReference(value) {
        super.setSegment(value, _a.PARTITIONS[this.getPartition()].b);
        return this;
    }
}
exports.Gsrn96 = Gsrn96;
_a = Gsrn96;
Gsrn96.EPC_HEADER = 0x2D;
Gsrn96.TOTAL_BITS = 96;
Gsrn96.PARTITION_OFFSET = 11;
Gsrn96.PARTITION_END = 14;
Gsrn96.TAG_URI = 'gsrn-96';
// F.C.S (Filter, Company, Service)
Gsrn96.TAG_URI_TEMPLATE = (filter, company, service) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${service}`; };
// C.S (Company, Service)
Gsrn96.PID_URI_TEMPLATE = (company, asset) => { return `urn:epc:id:gsrn:${company}.${asset}`; };
// Partition table columns: Company prefix, Service Reference
Gsrn96.PARTITIONS = [new partition_1.Partition(_a.PARTITION_END, 40, 12, 18, 5),
    new partition_1.Partition(_a.PARTITION_END, 37, 11, 21, 6),
    new partition_1.Partition(_a.PARTITION_END, 34, 10, 24, 7),
    new partition_1.Partition(_a.PARTITION_END, 30, 9, 28, 8),
    new partition_1.Partition(_a.PARTITION_END, 27, 8, 31, 9),
    new partition_1.Partition(_a.PARTITION_END, 24, 7, 34, 10),
    new partition_1.Partition(_a.PARTITION_END, 20, 6, 38, 11)]; // 6 20 06 38 11
