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
export declare class Gid96 extends Epc<Gid96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static MANAGER_OFFSET: number;
    static MANAGER_END: number;
    static MANAGER_BITS: number;
    static MAX_MANAGER: number;
    static CLASS_OFFSET: number;
    static CLASS_END: number;
    static CLASS_BITS: number;
    static MAX_CLASS: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (manager: number, clazz: number, serial: number) => string;
    static PID_URI_TEMPLATE: (manager: number, clazz: number, serial: number) => string;
    constructor(hexEpc?: string);
    toBarcode(): string;
    getFilter(): number;
    setFilter(): this;
    clone(): Gid96;
    getType(): Type;
    static fromTagURI(uri: string): Gid96;
    toTagURI(): string;
    toIdURI(): string;
    getTotalBits(): number;
    getHeader(): number;
    getManager(): number;
    setManager(value: number): this;
    getClass(): number;
    setClass(value: number): this;
    getSerial(): number;
    setSerial(value: number): this;
}
