/**
 * 96-bit Component / Part Identifier (CPI)
 *
 * The Component / Part EPC identifier is designed for use by the technical industries (including the
 * automotive sector) for the unique identification of parts or components.
 *
 * Typical use: Technical industries (e.g. automotive ) - components and parts
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Cpi96 extends Epc<Cpi96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, part: number, serial: number) => string;
    static PID_URI_TEMPLATE: (company: string, part: number, serial: number) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Cpi96;
    getType(): Type;
    static fromTagURI(uri: string): Cpi96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getCpi(): string;
    setCpi(cpi: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getPartReference(): number;
    setPartReference(value: number): this;
    getSerial(): number;
    setSerial(value: number): this;
}
