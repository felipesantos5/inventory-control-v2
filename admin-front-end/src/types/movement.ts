export interface ProductMovement {
  productName: string;
  movementCount: number;
}

export interface TopMovementProducts {
  [key: string]: ProductMovement;
}
