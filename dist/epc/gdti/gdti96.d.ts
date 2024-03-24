/**
 * 96-bit Global Document Type Identifier (GDTI)
 *
 * The Global Document Type Identifier EPC scheme is used to assign a unique identity to
 * a specific document, such as land registration papers, an insurance policy, and others.
 *
 * Typical use: Document
 *
 * @author Sergio S. - https://github.com/sergiss/epc-tds
 *
 */
import { Epc } from "../epc";
import { Partition } from "../partition";
import { Type } from "../type";
export declare class Gdti96 extends Epc<Gdti96> {
    static EPC_HEADER: number;
    static TOTAL_BITS: number;
    static PARTITION_OFFSET: number;
    static PARTITION_END: number;
    static SERIAL_OFFSET: number;
    static SERIAL_END: number;
    static SERIAL_BITS: number;
    static MAX_SERIAL: number;
    static TAG_URI: string;
    static TAG_URI_TEMPLATE: (filter: number, company: string, document: string, serial: number) => string;
    static PID_URI_TEMPLATE: (company: string, document: string, serial: number) => string;
    static PARTITIONS: Partition[];
    constructor(hexEpc?: string);
    clone(): Gdti96;
    getType(): Type;
    static fromTagURI(uri: string): Gdti96;
    toTagURI(): string;
    toIdURI(): string;
    toBarcode(): string;
    getTotalBits(): number;
    getHeader(): number;
    getPartition(): number;
    setPartition(value: number): this;
    getGdti(): string;
    setGdti(gdti: string): this;
    getCompanyPrefix(): number;
    setCompanyPrefix(value: number): this;
    getDocumentReference(): number;
    setDocumentReference(value: number): this;
    getSerial(): number;
    setSerial(value: number): this;
}
