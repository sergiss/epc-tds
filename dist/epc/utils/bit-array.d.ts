export declare class BitArray {
    static REVERSE_HEX_CHARS: string[];
    static REVERSE_DEC_TABLE: number[];
    length: number;
    data: number[];
    constructor(length: number);
    /**
     * Set selected bit
     * @param index
     */
    setBit(index: number): void;
    /**
     * Clear selected bit
     * @param index
     */
    clearBit(index: number): void;
    /**
     * Check if selected bit is set
     * @param offset
     * @return
     */
    isBit(index: number): number;
    /**
     * Clear data of bit array.
     */
    clear(): void;
    set(value: number | bigint, startIndex: number, endIndex: number): void;
    getBigInt(startIndex: number, endIndex: number): bigint;
    get(startIndex: number, endIndex: number): number;
    getSigned(startIndex: number, endIndex: number): number;
    setString(value: string, startIndex: number, endIndex: number, charBits: number): void;
    /**
     * Return string from bit array
     * @param startIndex offset
     * @param endIndex last bit
     * @param charBits how many bits has stored in a byte (max 8 bits)
     * @return
     */
    getString(startIndex: number, endIndex: number, charBits: number): string;
    /**
     * Return a hexadecimal string representation of the bit array.
     * @return hexadecimal base 16
     */
    toHexString(): string;
    /**
     * Return a binary string representation of the bit array.
     * @return binary base 2
     */
    toBitString(): string;
    setFromBitArray(bitArray: BitArray): BitArray;
    setFromHexString(hex: string): BitArray;
    not(): BitArray;
    or(bitArray: BitArray): BitArray;
    xor(bitArray: BitArray): BitArray;
    and(bitArray: BitArray): BitArray;
}
