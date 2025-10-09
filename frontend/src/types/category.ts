export interface Category {
  id: string;
  name: string;
  size: string;
  packaging: string;
}

export interface CreateCategoryData {
  name: string;
  size: string;
  packaging: string;
}
