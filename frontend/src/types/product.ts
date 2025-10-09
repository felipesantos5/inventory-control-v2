export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  unitOfMeasure: string;
  quantityInStock: number;
  minStockQuantity: number;
  maxStockQuantity: number;
  categoryId: number;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateProductData {
  name: string;
  unitPrice: number;
  unitOfMeasure: string;
  quantityInStock: number;
  minStockQuantity: number;
  maxStockQuantity: number;
  categoryId: number;
}
