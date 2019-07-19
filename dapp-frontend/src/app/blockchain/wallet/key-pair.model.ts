/**
 * A given address and private key found in the Web3 wallet file.
 */
export class KeyPair {
    constructor(
      public address: string,
      public privateKey: string,
    ) {}
}