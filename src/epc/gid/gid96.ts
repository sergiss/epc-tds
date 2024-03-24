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

import { Epc } from "../epc";
import { Type } from "../type";
import Utils from "../utils";
 
export class Gid96 extends Epc<Gid96> {

	static EPC_HEADER = 0x35;

	static TOTAL_BITS = 96;

    static MANAGER_OFFSET = 8;
	static MANAGER_END    = 36;
	static MANAGER_BITS   = 28;
	static MAX_MANAGER    = Utils.getMaxValue(Gid96.MANAGER_BITS);

	static CLASS_OFFSET   = 36;
	static CLASS_END      = 60;
	static CLASS_BITS     = 24;
	static MAX_CLASS      = Utils.getMaxValue(Gid96.CLASS_BITS);

	static SERIAL_OFFSET  = 60;
	static SERIAL_END     = Gid96.TOTAL_BITS;
	static SERIAL_BITS    = 36;
	static MAX_SERIAL     = Utils.getMaxValue(Gid96.SERIAL_BITS);

	static TAG_URI = 'gid-96';
	// M.C.S (Manager, Class, Serial)
	static TAG_URI_TEMPLATE = (manager: number, clazz: number, serial: number) => {return `urn:epc:tag:${this.TAG_URI}:${manager}.${clazz}.${serial}`};
	// M.C.S (Manager, Class, Serial)
	static PID_URI_TEMPLATE = (manager: number, clazz: number, serial: number) => {return `urn:epc:id:gid:${manager}.${clazz}.${serial}`}; 

	constructor(hexEpc?: string) {	
		super(Gid96.TOTAL_BITS);
		if(hexEpc) {
			super.setFromHexString(hexEpc);
		} else {
			super.set(Gid96.EPC_HEADER, Epc.EPC_HEADER_OFFSET, Epc.EPC_HEADER_END);
		}
	}

	toBarcode(): string {
		throw new Error('Unsupported method.');
	}

	getFilter(): number {
		throw new Error('Unsupported method.');
	}
	
	setFilter(): this {
		throw new Error('Unsupported method.');
	}

	clone() {
		return new Gid96().setFromBitArray(this) as Gid96;
	}

	getType() {
		return Type.GID96;
	}

	static fromTagURI(uri: string) {
		const value = uri.split(':');
		try {
			if(value[3] === this.TAG_URI) {
				const data = value[4].split('.');
				const result = new Gid96();
				result.setManager(parseInt(data[0]));
				result.setClass(parseInt(data[1]));
				result.setSerial(parseInt(data[2]));
				return result;
			}
		} catch (e) {
			// console.log(e)
		}
		throw new Error(`${uri} is not a known EPC tag URI scheme`);
	}

	toTagURI() { // M.C.S (Manager, Class, Serial)
		return Gid96.TAG_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
	}

	toIdURI() { // M.C.S (Manager, Class, Serial)
		return Gid96.PID_URI_TEMPLATE(this.getManager(), this.getClass(), this.getSerial());
	}

	getTotalBits() {
		return Gid96.TOTAL_BITS;
	}

	getHeader() {
		return Gid96.EPC_HEADER;
	}

    getManager() {
        return super.get(Gid96.MANAGER_OFFSET, Gid96.MANAGER_END);
    }

    setManager(value: number) {
		if(value > Gid96.MAX_MANAGER) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_MANAGER})`);
		super.set(value, Gid96.MANAGER_OFFSET, Gid96.MANAGER_END);
		return this;
    }

    getClass() {
        return super.get(Gid96.CLASS_OFFSET, Gid96.CLASS_END);
    }

    setClass(value: number) {
		if(value > Gid96.MAX_CLASS) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_CLASS})`);
		super.set(value, Gid96.CLASS_OFFSET, Gid96.CLASS_END);
		return this;
    }

	getSerial() {
		return super.get(Gid96.SERIAL_OFFSET, Gid96.SERIAL_END);
	}

	setSerial(value: number) {
		if(value > Gid96.MAX_SERIAL) throw new Error(`Value '${value}' out of range (min: 0, max: ${Gid96.MAX_SERIAL})`);
		super.set(value, Gid96.SERIAL_OFFSET, Gid96.SERIAL_END);
		return this;
	}

}
