/**
 * A user's collection of admin and voter keys.
 */
export class KeyPair {
    constructor(
      public adminAddress: string,
      public adminPrivateKey: string,
      public voterAddress: string,
      public voterPrivateKey: string,
    ) {}
}