export interface Keyword {
  id: number;
  name: string;
}

export type KeywordValue = Keyword | string;

export interface Town {
  id: number;
  name: string;
}

export interface Campaign {
  id: string;
  productId: string;
  name: string;
  keywords: KeywordValue[];
  bidAmount: number;
  fund: number;
  status: boolean;
  town: string;
  radius: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface Wallet {
  id: string;
  balance: string;
  updatedAt: string;
}

export type WalletUpdate = { balance: string };
