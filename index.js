/*
 * EPC Tag Data Standard
 * 2021 Sergio S. - https://github.com/sergiss/epc-tds
 */

"use strict";

const Utils = require("./epc/utils/utils");
const { Sgtin96 } = require("./epc/sgtin/sgtin96");
const { Sgtin198 } = require("./epc/sgtin/sgtin198");
const { Sgln96 } = require("./epc/sgln/sgln96");
const { Sgln195 } = require("./epc/sgln/sgln195");
const { Sscc96 } = require("./epc/sscc/sscc96");
const { Grai96 } = require("./epc/grai/grai96");
const { Grai170 } = require("./epc/grai/grai170");
const { Gid96 } = require("./epc/gid/gid96");
const { Giai96 } = require("./epc/giai/giai96");
const { Giai202 } = require("./epc/giai/giai202");
const { Gsrn96 } = require("./epc/gsrn/gsrn96");
const { Cpi96 } = require("./epc/cpi/cpi96");
const { Gdti96 } = require("./epc/gdti/gdti96");
const { Gdti174 } = require("./epc/gdti/gdti174");
const { Sgcn96 } = require("./epc/sgcn/sgcn96");

function fromTagURI(uri) {
  const value = uri.split(':');
  switch (value[3]) {
    case Sgtin96.TAG_URI:
      return Sgtin96.fromTagURI(uri);
    case Sgtin198.TAG_URI:
      return Sgtin198.fromTagURI(uri);
    case Grai96.TAG_URI:
      return Grai96.fromTagURI(uri);
    case Grai170.TAG_URI:
      return Grai170.fromTagURI(uri);
    case Sscc96.TAG_URI:
      return Sscc96.fromTagURI(uri);
    case Sgln96.TAG_URI:
      return Sgln96.fromTagURI(uri);
    case Sgln195.TAG_URI:
      return Sgln195.fromTagURI(uri);
    case Gid96.TAG_URI:
      return Gid96.fromTagURI(uri);
    case Giai96.TAG_URI:
      return Giai96.fromTagURI(uri);
    case Giai202.TAG_URI:
      return Giai202.fromTagURI(uri);
    case Gsrn96.TAG_URI:
      return Gsrn96.fromTagURI(uri);
    case Cpi96.TAG_URI:
      return Cpi96.fromTagURI(uri);
    case Gdti96.TAG_URI:
      return Gdti96.fromTagURI(uri);
    case Gdti174.TAG_URI:
      return Gdti174.fromTagURI(uri);
    case Sgcn96.TAG_URI:
      return Sgcn96.fromTagURI(uri);
    default:
      throw new Error(`Unsupported Tag URI: '${uri}'`);
  }
}

function valueOf(hexEpc) {
  let header = Utils.hexToByte(hexEpc, 0); // first byte of EPC
  switch (header) {
    case Grai96.EPC_HEADER:
      return new Grai96(hexEpc);
    case Grai170.EPC_HEADER:
      return new Grai170(hexEpc);
    case Sscc96.EPC_HEADER:
      return new Sscc96(hexEpc);
    case Sgln96.EPC_HEADER:
      return new Sgln96(hexEpc);
    case Sgln195.EPC_HEADER:
      return new Sgln195(hexEpc);
    case Sgtin96.EPC_HEADER:
      return new Sgtin96(hexEpc);
    case Sgtin198.EPC_HEADER:
      return new Sgtin198(hexEpc);
    case Gid96.EPC_HEADER:
      return new Gid96(hexEpc);
    case Giai96.EPC_HEADER:
      return new Giai96(hexEpc);
    case Giai202.EPC_HEADER:
      return new Giai202(hexEpc);
    case Gsrn96.EPC_HEADER:
      return new Gsrn96(hexEpc);
    case Cpi96.EPC_HEADER:
      return new Cpi96(hexEpc);
    case Gdti96.EPC_HEADER:
      return new Gdti96(hexEpc);
    case Gdti174.EPC_HEADER:
      return new Gdti174(hexEpc);
    case Sgcn96.EPC_HEADER:
      return new Sgcn96(hexEpc);
    default:
      throw new Error(`Unsupported EPC: '${hexEpc}'`);
  }
}

exports = module.exports = { Sgtin96, Sgtin198, Sgln96, Sgln195, Sscc96, Grai96, Grai170, Gid96, Giai96, Giai202, Gsrn96, Cpi96, Gdti96, Gdti174, Sgcn96, Utils };
exports.valueOf = valueOf;
exports.fromTagURI = fromTagURI;