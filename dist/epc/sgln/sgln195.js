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
exports.Sgln195 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const sgln96_1 = require("./sgln96");
const utils_1 = __importDefault(require("../utils"));
class Sgln195 extends epc_1.Epc {
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
        return type_1.Type.SGLN195;
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
                result.setExtension(data[3]);
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        return _a.TAG_URI_TEMPLATE(this.getFilter(), this.getSegmentString(partition.a), this.getSegmentString(partition.b), this.getExtension());
    }
    toIdURI() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
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
        if (value < 0 || value >= sgln96_1.Sgln96.PARTITIONS.length) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${sgln96_1.Sgln96.PARTITIONS.length - 1})`);
        }
        super.set(value, _a.PARTITION_OFFSET, _a.PARTITION_END);
        return this;
    }
    getGln() {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        let result = this.getSegmentString(partition.a) + this.getSegmentString(partition.b);
        return result + utils_1.default.computeCheckDigit(result);
    }
    setGln(gln) {
        let partition = sgln96_1.Sgln96.PARTITIONS[this.getPartition()];
        super.setSegment(Number(gln.substring(0, partition.a.digits)), partition.a);
        super.setSegment(Number(gln.substring(partition.a.digits, partition.a.digits + partition.b.digits)), partition.b);
        return this;
    }
    getCompany() {
        return super.getSegment(sgln96_1.Sgln96.PARTITIONS[this.getPartition()].a);
    }
    setCompany(value) {
        super.setSegment(value, sgln96_1.Sgln96.PARTITIONS[this.getPartition()].a);
        return this;
    }
    getLocation() {
        return super.getSegment(sgln96_1.Sgln96.PARTITIONS[this.getPartition()].b);
    }
    setLocation(value) {
        super.setSegment(value, sgln96_1.Sgln96.PARTITIONS[this.getPartition()].b);
        return this;
    }
    getExtension() {
        return super.getString(_a.EXTENSION_OFFSET, _a.EXTENSION_END, _a.CHAR_BITS);
    }
    /**
    * All values permitted by GS1 General Specifications (up to 20 alphanumeric characters)
    * @param value
    */
    setExtension(value) {
        if (!value || value.length > _a.MAX_EXTENSION_LEN)
            throw new Error(`Value '${value}' length out of range (max length: ${_a.MAX_EXTENSION_LEN})`);
        super.setString(value, _a.EXTENSION_OFFSET, _a.EXTENSION_END, _a.CHAR_BITS);
        return this;
    }
}
exports.Sgln195 = Sgln195;
_a = Sgln195;
Sgln195.EPC_HEADER = 0x39;
Sgln195.TOTAL_BITS = 195;
Sgln195.PARTITION_OFFSET = 11;
Sgln195.PARTITION_END = 14;
Sgln195.EXTENSION_OFFSET = 55;
Sgln195.EXTENSION_END = _a.TOTAL_BITS;
Sgln195.EXTENSION_BITS = 140;
Sgln195.MAX_EXTENSION_LEN = 20;
Sgln195.CHAR_BITS = (_a.EXTENSION_END - _a.EXTENSION_OFFSET) / _a.MAX_EXTENSION_LEN;
Sgln195.TAG_URI = 'sgln-195';
// F.C.L.E (Filter, Company, Location, Extension)
Sgln195.TAG_URI_TEMPLATE = (filter, company, location, extension) => { return `urn:epc:tag:${_a.TAG_URI}:${filter}.${company}.${location}.${extension}`; };
// C.L.E   (Company, Location, Extension)
Sgln195.PID_URI_TEMPLATE = (company, location, extension) => { return `urn:epc:id:sgln:${company}.${location}.${extension}`; };
