"use strict";
/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partition = void 0;
const segment_1 = require("./segment");
/**
 * Represents a partition of the EPC Tag Data Standard.
 */
class Partition {
    /**
     * Creates an instance of Partition.
     * @param offset The starting bit position for the first segment.
     * @param bits1 The number of bits allocated to the first segment.
     * @param digits1 The number of digits that the first segment can represent.
     * @param bits2 The number of bits allocated to the second segment.
     * @param digits2 The number of digits that the second segment can represent.
     */
    constructor(offset, bits1, digits1, bits2, digits2) {
        this.a = new segment_1.Segment(offset, bits1, digits1);
        this.b = new segment_1.Segment(this.a.end, bits2, digits2);
    }
}
exports.Partition = Partition;
