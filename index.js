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
    default:
      throw new Error(`Unsupported EPC: '${hexEpc}'`);
  }
}

exports = module.exports = { Sgtin96, Sgtin198, Sgln96, Sgln195, Sscc96, Grai96, Grai170, Gid96, Giai96, Giai202, Gsrn96, Cpi96, Utils };
exports.valueOf = valueOf;