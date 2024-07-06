/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sscc96_1 = require("./epc/sscc/sscc96");
const sgtin96_1 = require("./epc/sgtin/sgtin96");
const sgtin198_1 = require("./epc/sgtin/sgtin198");
const sgln96_1 = require("./epc/sgln/sgln96");
const sgln195_1 = require("./epc/sgln/sgln195");
const gsrn96_1 = require("./epc/gsrn/gsrn96");
const sgcn96_1 = require("./epc/sgcn/sgcn96");
const grai96_1 = require("./epc/grai/grai96");
const grai170_1 = require("./epc/grai/grai170");
const gid96_1 = require("./epc/gid/gid96");
const giai96_1 = require("./epc/giai/giai96");
const giai202_1 = require("./epc/giai/giai202");
const cpi96_1 = require("./epc/cpi/cpi96");
const gdti96_1 = require("./epc/gdti/gdti96");
const gdti174_1 = require("./epc/gdti/gdti174");
const epc_1 = __importDefault(require("./epc"));
const utils_1 = __importDefault(require("./epc/utils"));
function fromTagURI(uri) {
    const value = uri.split(':');
    switch (value[3]) {
        case sgtin96_1.Sgtin96.TAG_URI:
            return sgtin96_1.Sgtin96.fromTagURI(uri);
        case sgtin198_1.Sgtin198.TAG_URI:
            return sgtin198_1.Sgtin198.fromTagURI(uri);
        case grai96_1.Grai96.TAG_URI:
            return grai96_1.Grai96.fromTagURI(uri);
        case grai170_1.Grai170.TAG_URI:
            return grai170_1.Grai170.fromTagURI(uri);
        case sscc96_1.Sscc96.TAG_URI:
            return sscc96_1.Sscc96.fromTagURI(uri);
        case sgln96_1.Sgln96.TAG_URI:
            return sgln96_1.Sgln96.fromTagURI(uri);
        case sgln195_1.Sgln195.TAG_URI:
            return sgln195_1.Sgln195.fromTagURI(uri);
        case gid96_1.Gid96.TAG_URI:
            return gid96_1.Gid96.fromTagURI(uri);
        case giai96_1.Giai96.TAG_URI:
            return giai96_1.Giai96.fromTagURI(uri);
        case giai202_1.Giai202.TAG_URI:
            return giai202_1.Giai202.fromTagURI(uri);
        case gsrn96_1.Gsrn96.TAG_URI:
            return gsrn96_1.Gsrn96.fromTagURI(uri);
        case cpi96_1.Cpi96.TAG_URI:
            return cpi96_1.Cpi96.fromTagURI(uri);
        case gdti96_1.Gdti96.TAG_URI:
            return gdti96_1.Gdti96.fromTagURI(uri);
        case gdti174_1.Gdti174.TAG_URI:
            return gdti174_1.Gdti174.fromTagURI(uri);
        case sgcn96_1.Sgcn96.TAG_URI:
            return sgcn96_1.Sgcn96.fromTagURI(uri);
        default:
            throw new Error(`Unsupported Tag URI: '${uri}'`);
    }
}
function valueOf(hexEpc) {
    let header = utils_1.default.hexToByte(hexEpc, 0); // first byte of EPC
    switch (header) {
        case grai96_1.Grai96.EPC_HEADER:
            return new grai96_1.Grai96(hexEpc);
        case grai170_1.Grai170.EPC_HEADER:
            return new grai170_1.Grai170(hexEpc);
        case sscc96_1.Sscc96.EPC_HEADER:
            return new sscc96_1.Sscc96(hexEpc);
        case sgln96_1.Sgln96.EPC_HEADER:
            return new sgln96_1.Sgln96(hexEpc);
        case sgln195_1.Sgln195.EPC_HEADER:
            return new sgln195_1.Sgln195(hexEpc);
        case sgtin96_1.Sgtin96.EPC_HEADER:
            return new sgtin96_1.Sgtin96(hexEpc);
        case sgtin198_1.Sgtin198.EPC_HEADER:
            return new sgtin198_1.Sgtin198(hexEpc);
        case gid96_1.Gid96.EPC_HEADER:
            return new gid96_1.Gid96(hexEpc);
        case giai96_1.Giai96.EPC_HEADER:
            return new giai96_1.Giai96(hexEpc);
        case giai202_1.Giai202.EPC_HEADER:
            return new giai202_1.Giai202(hexEpc);
        case gsrn96_1.Gsrn96.EPC_HEADER:
            return new gsrn96_1.Gsrn96(hexEpc);
        case cpi96_1.Cpi96.EPC_HEADER:
            return new cpi96_1.Cpi96(hexEpc);
        case gdti96_1.Gdti96.EPC_HEADER:
            return new gdti96_1.Gdti96(hexEpc);
        case gdti174_1.Gdti174.EPC_HEADER:
            return new gdti174_1.Gdti174(hexEpc);
        case sgcn96_1.Sgcn96.EPC_HEADER:
            return new sgcn96_1.Sgcn96(hexEpc);
        default:
            throw new Error(`Unsupported EPC: '${hexEpc}'`);
    }
}
const TDS = {
    fromTagURI, valueOf, Utils: utils_1.default,
    Sscc96: sscc96_1.Sscc96, Sgtin96: sgtin96_1.Sgtin96, Sgtin198: sgtin198_1.Sgtin198, Sgln96: sgln96_1.Sgln96, Sgln195: sgln195_1.Sgln195, Gsrn96: gsrn96_1.Gsrn96, Sgcn96: sgcn96_1.Sgcn96, Grai96: grai96_1.Grai96, Grai170: grai170_1.Grai170, Gid96: gid96_1.Gid96, Giai96: giai96_1.Giai96, Giai202: giai202_1.Giai202, Cpi96: cpi96_1.Cpi96, Gdti96: gdti96_1.Gdti96, Gdti174: gdti174_1.Gdti174, Epc: epc_1.default
};
exports.default = TDS;
module.exports = TDS;
