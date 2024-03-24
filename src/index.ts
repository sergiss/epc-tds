/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */

"use strict";

import { Sscc96 } from "./epc/sscc/sscc96";
import { Sgtin96 } from "./epc/sgtin/sgtin96";
import { Sgtin198 } from "./epc/sgtin/sgtin198";
import { Sgln96 } from "./epc/sgln/sgln96";
import { Sgln195 } from "./epc/sgln/sgln195";
import { Gsrn96 } from "./epc/gsrn/gsrn96";
import { Sgcn96 } from "./epc/sgcn/sgcn96";
import { Grai96 } from "./epc/grai/grai96";
import { Grai170 } from "./epc/grai/grai170";
import { Gid96 } from "./epc/gid/gid96";
import { Giai96 } from "./epc/giai/giai96";
import { Giai202 } from "./epc/giai/giai202";
import { Cpi96 } from "./epc/cpi/cpi96";
import { Gdti96 } from "./epc/gdti/gdti96";
import { Gdti174 } from "./epc/gdti/gdti174";
import Epc from "./epc";

import Utils from "./epc/utils";

function fromTagURI(uri: string) {
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

function valueOf(hexEpc: string) {
  console.log(hexEpc);
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

const TDS = { 
  fromTagURI, valueOf, Utils, 
  Sscc96, Sgtin96, Sgtin198, Sgln96, Sgln195, Gsrn96, Sgcn96, Grai96, Grai170, Gid96, Giai96, Giai202, Cpi96, Gdti96, Gdti174, Epc
};

export default TDS;
module.exports = TDS;