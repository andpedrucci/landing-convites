// lib/coupons.ts

export type ProductType = 'TEMPLATE' | 'PERSONALIZADO' | 'MESVERSARIO' | 'ALL';

export interface Coupon {
  code: string;
  discountPercentage: number;
  isActive: boolean;
  allowedProduct: ProductType; // Define onde o cupom pode ser usado
}

export const AVAILABLE_COUPONS: Coupon[] = [
  // Cupons exclusivos para Templates (Preço base 47)
  { code: 'ESPECIAL10', discountPercentage: 15, isActive: true, allowedProduct: 'TEMPLATE' },
  
  // Cupons exclusivos para Personalizados (Preço base 147)
  { code: 'ESPECIAL10', discountPercentage: 20, isActive: true, allowedProduct: 'PERSONALIZADO' },
  
  // Cupom que funciona em qualquer um
  //{ code: 'STUDIO1014528', discountPercentage: 10, isActive: true, allowedProduct: 'MESVERSARIO' },
];
