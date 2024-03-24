"use strict";
/**
 * 96-bit Serialised Global Trade Item Number (SGTIN)
 *
 * The General Identifier EPC scheme is independent of any specifications or identity scheme outside
 * the EPCglobal Tag Data Standard.
 *
 * Typical use: Unspecified
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gid96 = void 0;
const epc_1 = require("../epc");
const type_1 = require("../type");
const utils_1 = __importDefault(require("../utils"));
class Gid96 extends epc_1.Epc {
    constructor(hexEpc) {
        super(_a.TOTAL_BITS);
        if (hexEpc) {
            super.setFromHexString(hexEpc);
        }
        else {
            super.set(_a.EPC_HEADER, epc_1.Epc.EPC_HEADER_OFFSET, epc_1.Epc.EPC_HEADER_END);
        }
    }
    toBarcode() {
        throw new Error('Unsupported method.');
    }
    getFilter() {
        throw new Error('Unsupported method.');
    }
    setFilter() {
        throw new Error('Unsupported method.');
    }
    clone() {
        return new _a().setFromBitArray(this);
    }
    getType() {
        return type_1.Type.GID96;
    }
    static fromTagURI(uri) {
        const value = uri.split(':');
        try {
            if (value[3] === this.TAG_URI) {
                const data = value[4].split('.');
                const result = new _a();
                result.setManager(parseInt(data[0]));
                result.setClass(parseInt(data[1]));
                result.setSerial(parseInt(data[2]));
                return result;
            }
        }
        catch (e) {
            // console.log(e)
        }
        throw new Error(`${uri} is not a known EPC tag URI scheme`);
    }
    toTagURI() {
        return _a.TAG_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
    }
    toIdURI() {
        return _a.PID_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
    }
    getTotalBits() {
        return _a.TOTAL_BITS;
    }
    getHeader() {
        return _a.EPC_HEADER;
    }
    getManager() {
        return super.get(_a.MANAGER_OFFSET, _a.MANAGER_END);
    }
    setManager(value) {
        if (value > _a.MAX_MANAGER)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_MANAGER})`);
        super.set(value, _a.MANAGER_OFFSET, _a.MANAGER_END);
        return this;
    }
    getClass() {
        return super.get(_a.CLASS_OFFSET, _a.CLASS_END);
    }
    setClass(value) {
        if (value > _a.MAX_CLASS)
            throw new Error(`Value '${value}' out of range (min: 0, max: ${_a.MAX_CLASS})`);
        super.set(value, _a.CLASS_OFFSET, _a.CLASS_END);
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
exports.Gid96 = Gid96;
_a = Gid96;
Gid96.EPC_HEADER = 0x35;
Gid96.TOTAL_BITS = 96;
Gid96.MANAGER_OFFSET = 8;
Gid96.MANAGER_END = 36;
Gid96.MANAGER_BITS = 28;
Gid96.MAX_MANAGER = utils_1.default.getMaxValue(_a.MANAGER_BITS);
Gid96.CLASS_OFFSET = 36;
Gid96.CLASS_END = 60;
Gid96.CLASS_BITS = 24;
Gid96.MAX_CLASS = utils_1.default.getMaxValue(_a.CLASS_BITS);
Gid96.SERIAL_OFFSET = 60;
Gid96.SERIAL_END = _a.TOTAL_BITS;
Gid96.SERIAL_BITS = 36;
Gid96.MAX_SERIAL = utils_1.default.getMaxValue(_a.SERIAL_BITS);
Gid96.TAG_URI = 'gid-96';
// M.C.S (Manager, Class, Serial)
Gid96.TAG_URI_TEMPLATE = (manager, clazz, serial) => { return `urn:epc:tag:${_a.TAG_URI}:${manager}.${clazz}.${serial}`; };
// M.C.S (Manager, Class, Serial)
Gid96.PID_URI_TEMPLATE = (manager, clazz, serial) => { return `urn:epc:id:gid:${manager}.${clazz}.${serial}`; };
