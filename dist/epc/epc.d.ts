import { Segment } from "./segment";
import { BitArray } from "./utils/bit-array";
/**
 * Represents an EPC (Electronic Product Code) of the EPC Tag Data Standard.
 */
export declare abstract class Epc<T extends Epc<T>> extends BitArray {
    static EPC_HEADER_OFFSET: number;
    static EPC_HEADER_END: number;
    static FILTER_OFFSET: number;
    static FILTER_END: number;
    static FILTER_MAX_VALUE: number;
    /**
     * Creates an instance of Epc.
     * @param length The total number of bits of the EPC.
     */
    constructor(length: number);
    /**
     * Clone the EPC object
     */
    abstract clone(): T;
    /**
     * Get the type of the EPC
     */
    abstract getType(): string;
    /**
     * Get the header value of the EPC
     */
    abstract toTagURI(): string;
    /**
     * Get the URI representation of the EPC
     */
    abstract toIdURI(): string;
    /**
     * Get the barcode representation of the EPC
     */
    abstract toBarcode(): string;
    /**
     * Get the total number of bits of the EPC
     */
    abstract getTotalBits(): number;
    /**
     * Get the header value of the EPC
     */
    abstract getHeader(): number;
    /**
     * The filter value is additional control information that may be included in
     * the EPC memory bank of a Gen 2 tag. The intended use of the filter value is
     * to allow an RFID reader to select or deselect the tags corresponding to
     * certain physical objects, to make it easier to read the desired tags in an
     * environment where there may be other tags present in the environment
     * @return
     */
    getFilter(): number;
    /**
     * 0.- All Others (see Section 10.1).
     * 1.- Point of Sale (POS) Trade Item .
     * 2.- Full Case for Transport.
     * 3.- Reserved (see Section 10.1).
     * 4.- Inner Pack Trade Item Grouping for Handling.
     * 5.- Reserved (see Section 10.1).
     * 6.- Unit Load.
     * 7.- Unit inside Trade Item or component inside a
     *     product not intended for individual sale.
     * @param value
     */
    setFilter(value: number): this;
    /**
     * Get the value of a segment as BigInt
     * @param segment
     * @return
     */
    getSegmentBigInt(segment: Segment): bigint;
    /**
     * Get the value of a segment
     * @param segment
     * @return
     */
    getSegment(segment: Segment): number;
    /**
     * Set the value of a segment
     * @param value
     * @param segment
     */
    setSegment(value: number | bigint, segment: Segment): void;
    /**
     * Return segment as string with leading zeros
     * @param {*} segment
     * @returns
     */
    getSegmentString(segment: Segment): string;
}
