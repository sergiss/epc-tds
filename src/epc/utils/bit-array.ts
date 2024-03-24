/*
 * EPC Tag Data Standard
 * 2024 Sergio S. - https://github.com/sergiss/epc-tds
 */

export class BitArray {

  static REVERSE_HEX_CHARS = ['0','8','4','C','2','A','6','E','1','9','5' ,'D' ,'3' ,'B' ,'7' ,'F'];

  static REVERSE_DEC_TABLE = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1, 0,8,4,12,2,10,6,14,1,9,-1,-1,-1,-1,
                              -1,-1,-1,5,13,3,11,7,15,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                              -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,13,3,11,7,15,-1];

  length: number;
  data: number[];

  constructor(length: number) {
    this.length = (length + 7) >> 3;
    this.data = [];
  }

  /**
   * Set selected bit
   * @param index
   */
  setBit(index: number): void {
    this.data[index >> 3] |= 1 << (index & 7);
  }

  /**
   * Clear selected bit
   * @param index
   */
  clearBit(index: number): void {
    this.data[index >> 3] &= ~(1 << (index & 7));
  }

  /**
   * Check if selected bit is set
   * @param offset
   * @return
   */
  isBit(index: number): number {
    return (this.data[index >> 3] >> (index & 7)) & 0b1;
  }

  /**
   * Clear data of bit array.
   */
  clear(): void {
    for (let i = 0; i < this.length; i++) {
      this.data[i] = 0;
    }
  }

  set(value: number | bigint, startIndex: number, endIndex: number): void {
    let v = BigInt(value);
    for (let i = BigInt(0); startIndex < endIndex; i++) {
      endIndex--;
      if ((v >> i) & BigInt(1)) {
        // check bit
        this.setBit(endIndex);
      } else {
        this.clearBit(endIndex);
      }
    }
  }

  getBigInt(startIndex: number, endIndex: number): bigint {
    let result = BigInt(0);
    for (let i = BigInt(0); startIndex < endIndex; i++) {
      if (this.isBit(--endIndex)) {
        result |= BigInt(1) << i; // set bit
      }
    }
    return result;
  }

  get(startIndex: number, endIndex: number): number {
    return Number(this.getBigInt(startIndex, endIndex));
  }

  getSigned(startIndex: number, endIndex: number): number {
    let i,
      result = BigInt(0);
    for (i = BigInt(0); startIndex < endIndex; i++) {
      if (this.isBit(--endIndex)) {
        result |= BigInt(1) << i; // set bit
      }
    }
    let mask = BigInt(1) << (i - BigInt(1));
    if (result & mask) {
      // check first bit
      result = (mask ^ result) - mask;
    }
    return Number(result);
  }

  setString(
    value: string,
    startIndex: number,
    endIndex: number,
    charBits: number
  ): void {
    for (
      let i = 0;
      i < value.length &&
      (charBits = Math.min(charBits, endIndex - startIndex)) > 0;
      ++i
    ) {
      // iterate bytes
      this.set(value.charCodeAt(i), startIndex, (startIndex += charBits));
    }
    for (; startIndex < endIndex; ++startIndex) {
      // clear remaining bits
      this.clearBit(startIndex);
    }
  }

  /**
   * Return string from bit array
   * @param startIndex offset
   * @param endIndex last bit
   * @param charBits how many bits has stored in a byte (max 8 bits)
   * @return
   */
  getString(startIndex: number, endIndex: number, charBits: number): string {
    let b,
      result = "";
    for (
      let i = 0;
      (charBits = Math.min(charBits, endIndex - startIndex)) > 0;
      ++i
    ) {
      // iterate bytes
      if ((b = this.get(startIndex, (startIndex += charBits)))) {
        result += String.fromCharCode(b);
      }
    }
    return result;
  }

  /**
   * Return a hexadecimal string representation of the bit array.
   * @return hexadecimal base 16
   */
  toHexString(): string {
    let b,
      result = "";
    for (let i = 0; i < this.length; ++i) {
      b = this.data[i]; // iterate bytes
      result +=
        BitArray.REVERSE_HEX_CHARS[b & 0xf] +
        BitArray.REVERSE_HEX_CHARS[(b & 0xf0) >> 4];
    }
    return result;
  }

  /**
   * Return a binary string representation of the bit array.
   * @return binary base 2
   */
  toBitString(): string {
    let b,
      result = "";
    for (let i = 0; i < this.length; ++i) {
      b = this.data[i]; // iterate bytes
      for (let j = 0; j < 8; ++j) {
        result += (b >>> j) & 0b1 ? "1" : "0";
      }
    }
    return result;
  }

  setFromBitArray(bitArray: BitArray): BitArray {
    this.data = [...bitArray.data];
    return this;
  }

  setFromHexString(hex: string): BitArray {
    if (hex.length & 0b1) {
      // odd check
      hex = "0" + hex; // even hex
    }
    this.data = new Array(hex.length >> 1);
    for (let j = 0, i = 0; i < this.length; i++, j += 2) {
      this.data[i] =
        BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j)] |
        (BitArray.REVERSE_DEC_TABLE[hex.charCodeAt(j + 1)] << 4);
    }
    return this;
  }

  not(): BitArray {
    let result = new BitArray(this.length << 3);
    for (let i = 0; i < result.data.length; ++i) {
      result.data[i] = ~this.data[i];
    }
    return result;
  }

  or(bitArray: BitArray): BitArray {
    let result;
    if (bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }
    for (let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] | this.data[i];
    }
    return result;
  }

  xor(bitArray: BitArray): BitArray {
    let result;
    if (bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }
    for (let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] ^ this.data[i];
    }
    return result;
  }

  and(bitArray: BitArray): BitArray {
    let result;
    if (bitArray.length > this.length) {
      result = new BitArray(bitArray.data.length << 3);
    } else {
      result = new BitArray(this.length << 3);
    }
    for (let i = 0; i < result.data.length; ++i) {
      result.data[i] = bitArray.data[i] & this.data[i];
    }
    return result;
  }
}
