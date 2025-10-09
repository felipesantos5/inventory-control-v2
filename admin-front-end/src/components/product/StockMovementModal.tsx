import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Package, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

const movementSchema = z.object({
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
});

interface StockMovementModalProps {
  product: Product;
  onMovementCompleted: () => void;
  trigger?: React.ReactNode;
}

export function StockMovementModal({
  product,
  onMovementCompleted,
  trigger,
}: StockMovementModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("entry");

  const form = useForm<{ quantity: number }>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const handleMovement = async (
    data: { quantity: number },
    type: "entry" | "exit"
  ) => {
    try {
      setIsProcessing(true);

      await api.post(`/stock-movements/${type}`, {
        productId: product.id,
        quantity: data.quantity,
      });

      onMovementCompleted();
      setIsOpen(false);
      form.reset();

      const actionText = type === "entry" ? "Entrada" : "Saída";
      toast.success(`${actionText} de estoque realizada com sucesso`);
    } catch (error) {
      console.error(`Erro ao processar ${type}:`, error);
      const actionText = type === "entry" ? "entrada" : "saída";
      toast.error(`Erro ao processar ${actionText} de estoque`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEntry = (data: { quantity: number }) => {
    handleMovement(data, "entry");
  };

  const handleExit = (data: { quantity: number }) => {
    handleMovement(data, "exit");
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" title="Movimentar Estoque">
      <Package className="h-5 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Movimentação de Estoque
          </DialogTitle>
          <DialogDescription>
            Registre entrada ou saída de estoque para o produto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium">Produto:</span>
                  <p className="ml-1 text-muted-foreground">{product.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="font-medium">Estoque Atual:</span>
                    <p
                      className={`ml-1 ${
                        product.quantityInStock <= product.minStockQuantity
                          ? "text-red-600 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {product.quantityInStock} {product.unitOfMeasure}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs para Entrada/Saída */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entry" className="flex items-center gap-2">
                <ArrowUp className="h-5 w-4" />
                Entrada
              </TabsTrigger>
              <TabsTrigger value="exit" className="flex items-center gap-2">
                <ArrowDown className="h-5 w-4" />
                Saída
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEntry)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-green-600">
                          <ArrowUp className="h-5 w-4" />
                          Quantidade de Entrada
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Digite a quantidade"
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

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ArrowUp className="mr-2 h-5 w-4" />
                          Registrar Entrada
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="exit" className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleExit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-red-600">
                          <ArrowDown className="h-5 w-4" />
                          Quantidade de Saída
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max={product.quantityInStock}
                            placeholder="Digite a quantidade"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                        {product.quantityInStock <=
                          product.minStockQuantity && (
                          <p className="text-xs text-amber-600">
                            ⚠️ Estoque baixo! Atual: {product.quantityInStock}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-2 h-5 w-4" />
                          Registrar Saída
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
