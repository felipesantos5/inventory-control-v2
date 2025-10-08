import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateProductModal } from "@/components/product/CreateProductModal";
import { EditProductModal } from "@/components/product/EditProductModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { AdjustPriceModal } from "@/components/product/AdjustPriceModal";
import { productsService } from "@/services/products";
import type { Product } from "@/types/product";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDelete = async (id: string) => {
    await productsService.delete(id);
    setProducts(products.filter((product) => product.id !== id));
    toast.success("Produto excluído com sucesso");
  };

  const handlePricesAdjusted = () => {
    loadProducts(); // Recarrega a lista após ajuste de preços
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Produtos</h1>
        <div className="flex gap-3">
          <AdjustPriceModal onPricesAdjusted={handlePricesAdjusted} />
          <CreateProductModal onProductCreated={handleProductCreated} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Mín/Máx</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">
                      {product.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{formatPrice(product.unitPrice)}</TableCell>
                    <TableCell>{product.unitOfMeasure}</TableCell>
                    <TableCell>
                      <span
                        className={`${
                          product.quantityInStock <= product.minStockQuantity
                            ? "text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        {product.quantityInStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.minStockQuantity} / {product.maxStockQuantity}
                    </TableCell>
                    <TableCell>{product.categoryId}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditProductModal
                          product={product}
                          onUpdate={handleProductUpdated}
                        />
                        <DeleteConfirmModal
                          title="Excluir Produto"
                          itemName={product.name}
                          onConfirm={() => handleDelete(product.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
