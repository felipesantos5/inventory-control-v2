import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/CategorySelect";
import { productsService } from "@/services/products";
import type { Product, CreateProductData } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  unitPrice: z.number().min(0, "Preço deve ser maior que 0"),
  unitOfMeasure: z.string().min(1, "Unidade de medida é obrigatória"),
  quantityInStock: z.number().min(0, "Quantidade deve ser maior ou igual a 0"),
  minStockQuantity: z
    .number()
    .min(0, "Estoque mínimo deve ser maior ou igual a 0"),
  maxStockQuantity: z
    .number()
    .min(0, "Estoque máximo deve ser maior ou igual a 0"),
  categoryId: z.number().min(1, "Categoria é obrigatória"),
});

interface EditProductModalProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  trigger?: React.ReactNode;
}

export function EditProductModal({
  product,
  onUpdate,
  trigger,
}: EditProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<CreateProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      unitPrice: product.unitPrice,
      unitOfMeasure: product.unitOfMeasure,
      quantityInStock: product.quantityInStock,
      minStockQuantity: product.minStockQuantity,
      maxStockQuantity: product.maxStockQuantity,
      categoryId: product.categoryId,
    },
  });

  useEffect(() => {
    form.reset({
      name: product.name,
      unitPrice: product.unitPrice,
      unitOfMeasure: product.unitOfMeasure,
      quantityInStock: product.quantityInStock,
      minStockQuantity: product.minStockQuantity,
      maxStockQuantity: product.maxStockQuantity,
      categoryId: product.categoryId,
    });
  }, [product, form]);

  const handleUpdate = async (data: CreateProductData) => {
    try {
      setIsUpdating(true);
      const updatedProduct = await productsService.update(product.id, data);
      onUpdate(updatedProduct);
      setIsOpen(false);
      toast.success("Produto atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar produto");
    } finally {
      setIsUpdating(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Pencil className="h-5 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Altere os dados do produto</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Unitário</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitOfMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade de Medida</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: UN, KG, L" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantityInStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Atual</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Mínimo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Máximo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <CategorySelect
                      value={field.value}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
