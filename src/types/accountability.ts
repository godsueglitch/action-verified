export interface Actor {
  address: string;
  label?: string;
  hasApproved: boolean;
  approvedAt?: Date;
}

export interface AccountabilityRequest {
  id: string;
  title: string;
  description: string;
  actors: Actor[];
  deadline: Date;
  minimumApprovals: number;
  createdAt: Date;
  createdBy: string;
  status: 'pending' | 'fulfilled' | 'failed';
  txHash?: string;
  finalizedAt?: Date;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: 'testnet' | 'mainnet' | null;
}

export const DEMO_ADDRESSES = [
  'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgs68faae',
  'addr_test1qp8v2glsdxlz6vc8tnxg8umd6x3djq5uxhfyh2m3x9qrw5lgc0qj2p5v5xqmvq9mzk4tqtdjqwkxg5gqcdfnxr5xeqys0k7pk4',
  'addr_test1qr5gxr8q4phw7l3kxhm0z0dzk3l0yp3v9m3k4w5x6nqr7j8c2d5f6g7h8j9k0l1m2n3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8',
];

export const DEMO_USER_ADDRESS = 'addr_test1qz9ek3m8g7h2w4k5n6p9r0t2u3v5w6x8y9z0a1b2c3d4e5f6g7h8j9k0l1m2n3p4q5r6s7t8u9v0w1x2y3z4your_wallet';
