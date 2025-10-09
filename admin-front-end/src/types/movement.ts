export interface ProductMovement {
  productName: string;
  movementCount: number;
}

export interface TopMovementProducts {
  topEntryProduct: ProductMovement;
  topExitProduct: ProductMovement;
}
