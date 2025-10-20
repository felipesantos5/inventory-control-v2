import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
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
  categoryId: z.number(),
});

interface CreateProductModalProps {
  onProductCreated: (product: Product) => void;
  trigger?: React.ReactNode;
}

export function CreateProductModal({
  onProductCreated,
  trigger,
}: CreateProductModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CreateProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      unitPrice: 0,
      unitOfMeasure: "",
      quantityInStock: 0,
      minStockQuantity: 0,
      maxStockQuantity: 0,
      categoryId: 0,
    },
  });

  const handleCreate = async (data: CreateProductData) => {
    try {
      setIsCreating(true);
      const newProduct = await productsService.create(data);
      onProductCreated(newProduct);
      setIsOpen(false);
      form.reset();
      toast.success("Produto criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Erro ao criar produto");
    } finally {
      setIsCreating(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-5 w-4" />
      Novo Produto
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo produto
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
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
                      // Modifique esta linha:
                      onValueChange={(value) =>
                        field.onChange(parseInt(value) || 0)
                      }
                      // Adicione `|| 0` para garantir que um número seja passado,
                      // mesmo que parseInt retorne NaN.
                    />
                  </FormControl>
                  {/* A mensagem de erro Zod ainda aparecerá corretamente
                      se nenhuma categoria válida for selecionada (valor 0 falha no min(1)),
                      mas o erro específico de NaN deve desaparecer. */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Produto"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
