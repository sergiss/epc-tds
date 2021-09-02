/*
* EPC Tag Data Standard
* 2021 Sergio S.
*/

"use strict";

const Utils = require('./epc/utils/utils');
const { Sgtin96 }  = require("./epc/sgtin/sgtin96");
const { Sgtin198 } = require("./epc/sgtin/sgtin198");
const { Sgln96 }   = require("./epc/sgln/sgln96");
const { Sgln195 }  = require("./epc/sgln/sgln195");
const { Sscc96 }   = require('./epc/sscc/sscc96');
const { Grai96 }   = require('./epc/grai/grai96');
const { Grai170 }  = require('./epc/grai/grai170');
const { Gid96 }    = require('./epc/gid/gid96');

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
	default:
		throw new Error(`Unsupported EPC: '${hexEpc}'`);
	}
}

exports = module.exports = { Sgtin96, Sgtin198, Sgln96, Sgln195, Sscc96, Grai96, Grai170, Gid96, Utils };
exports.valueOf = valueOf;