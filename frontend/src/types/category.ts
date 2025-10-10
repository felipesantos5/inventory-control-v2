export interface Category {
  id: string;
  name: string;
  size: string;
  packaging: string;
  productCount: number;
}

export interface CreateCategoryData {
  name: string;
  size: string;
  packaging: string;
}
