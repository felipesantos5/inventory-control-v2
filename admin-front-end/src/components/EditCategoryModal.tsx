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
import { categoriesService } from "@/services/categories";
import type { Category, CreateCategoryData } from "@/types/category";

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  size: z.string().min(1, "Tamanho é obrigatório"),
  packaging: z.string().min(1, "Embalagem é obrigatória"),
});

interface EditCategoryModalProps {
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
  trigger?: React.ReactNode;
}

export function EditCategoryModal({
  category,
  onUpdate,
  trigger,
}: EditCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<CreateCategoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      size: category.size,
      packaging: category.packaging,
    },
  });

  // Atualiza os valores do form quando a categoria muda
  useEffect(() => {
    form.reset({
      name: category.name,
      size: category.size,
      packaging: category.packaging,
    });
  }, [category, form]);

  const handleUpdate = async (data: CreateCategoryData) => {
    try {
      setIsUpdating(true);
      const updatedCategory = await categoriesService.update(category.id, data);
      onUpdate(updatedCategory);
      setIsOpen(false);
      toast.success("Categoria atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
    } finally {
      setIsUpdating(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Pencil className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>Altere os dados da categoria</DialogDescription>
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
                    <Input
                      placeholder="Digite o nome da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Pequeno, Médio, Grande"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embalagem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Caixa, Saco, Frasco" {...field} />
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
