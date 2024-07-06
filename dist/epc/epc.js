"use strict";
/*
* EPC Tag Data Standard
* 2024 Sergio S. - https://github.com/sergiss/epc-tds
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epc = void 0;
const bit_array_1 = require("./utils/bit-array");
/**
 * Represents an EPC (Electronic Product Code) of the EPC Tag Data Standard.
 */
class Epc extends bit_array_1.BitArray {
    /**
     * Creates an instance of Epc.
     * @param length The total number of bits of the EPC.
     */
    constructor(length) {
        super(length);
    }
    /**
     * The filter value is additional control information that may be included in
     * the EPC memory bank of a Gen 2 tag. The intended use of the filter value is
     * to allow an RFID reader to select or deselect the tags corresponding to
     * certain physical objects, to make it easier to read the desired tags in an
     * environment where there may be other tags present in the environment
     * @return
     */
    getFilter() {
        return super.get(Epc.FILTER_OFFSET, Epc.FILTER_END);
    }
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
    setFilter(value) {
        if (value < 0 || value > Epc.FILTER_MAX_VALUE) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${Epc.FILTER_MAX_VALUE})`);
        }
        super.set(value, Epc.FILTER_OFFSET, Epc.FILTER_END);
        return this;
    }
    /**
     * Get the value of a segment as BigInt
     * @param segment
     * @return
     */
    getSegmentBigInt(segment) {
        return super.getBigInt(segment.start, segment.end);
    }
    /**
     * Get the value of a segment
     * @param segment
     * @return
     */
    getSegment(segment) {
        return super.get(segment.start, segment.end);
    }
    /**
     * Set the value of a segment
     * @param value
     * @param segment
     */
    setSegment(value, segment) {
        if (value < 0 || value > segment.maxValue) {
            throw new Error(`Value '${value}' out of range (min: 0, max: ${segment.maxValue})`);
        }
        super.set(value, segment.start, segment.end);
    }
    /**
     * Return segment as string with leading zeros
     * @param {*} segment
     * @returns
     */
    getSegmentString(segment) {
        return String(this.getSegmentBigInt(segment)).padStart(segment.digits, '0');
    }
}
exports.Epc = Epc;
Epc.EPC_HEADER_OFFSET = 0;
Epc.EPC_HEADER_END = 8;
Epc.FILTER_OFFSET = 8;
Epc.FILTER_END = 11;
Epc.FILTER_MAX_VALUE = 7;
