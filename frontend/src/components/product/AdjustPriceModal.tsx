import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calculator, Loader2, TrendingUp, TrendingDown } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/axios";
import { productsService } from "@/services/products";
import type { Product } from "@/types/product";

const adjustSchema = z.object({
  percentage: z
    .number()
    .min(-100, "Percentual não pode ser menor que -100%")
    .max(1000, "Percentual muito alto"),
});

interface AdjustPriceModalProps {
  onPricesAdjusted: () => void;
  trigger?: React.ReactNode;
}

export function AdjustPriceModal({
  onPricesAdjusted,
  trigger,
}: AdjustPriceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [previewPercentage, setPreviewPercentage] = useState(0);

  const form = useForm<{ percentage: number }>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      percentage: 0,
    },
  });

  const watchedPercentage = form.watch("percentage");

  useEffect(() => {
    setPreviewPercentage(watchedPercentage || 0);
  }, [watchedPercentage]);

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleAdjustPrices = async (data: { percentage: number }) => {
    try {
      setIsAdjusting(true);
      await api.post("/products/adjust-price", {
        percentage: data.percentage,
      });

      onPricesAdjusted();
      setIsOpen(false);
      form.reset();
      toast.success(
        `Preços ajustados em ${data.percentage > 0 ? "+" : ""}${
          data.percentage
        }%`
      );
    } catch (error) {
      console.error("Erro ao ajustar preços:", error);
      toast.error("Erro ao ajustar preços");
    } finally {
      setIsAdjusting(false);
    }
  };

  const calculateNewPrice = (currentPrice: number, percentage: number) => {
    return currentPrice * (1 + percentage / 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getPriceDifference = (currentPrice: number, newPrice: number) => {
    return newPrice - currentPrice;
  };

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const defaultTrigger = (
    <Button variant="outline">
      <Calculator className="mr-2 h-5 w-4" />
      Ajustar Preços
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Ajustar Preços dos Produtos
          </DialogTitle>
          <DialogDescription>
            Defina um percentual para ajustar todos os preços. Valores positivos
            aumentam, negativos diminuem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Percentual de Ajuste</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAdjustPrices)}
                  className="space-y-4"
                >
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="percentage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Percentual (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Ex: 10 para +10%, -5 para -5%"
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
                    <div className="flex items-end">
                      <Button
                        type="submit"
                        disabled={isAdjusting || isLoadingProducts}
                      >
                        {isAdjusting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5animate-spin" />
                            Ajustando...
                          </>
                        ) : (
                          "Aplicar Ajuste"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>

              {previewPercentage !== 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {previewPercentage > 0 ? (
                      <>
                        <TrendingUp className="h-5 w-5text-green-600" />
                        <span className="text-green-600">
                          Aumento de {previewPercentage}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-5 w-5text-red-600" />
                        <span className="text-red-600">
                          Redução de {Math.abs(previewPercentage)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview dos Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Carregando produtos...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {products.map((product, index) => {
                    const newPrice = calculateNewPrice(
                      product.unitPrice,
                      previewPercentage
                    );
                    const difference = getPriceDifference(
                      product.unitPrice,
                      newPrice
                    );

                    return (
                      <div key={product.id}>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {product.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-right">
                              <div className="text-muted-foreground">Atual</div>
                              <div className="font-medium">
                                {formatPrice(product.unitPrice)}
                              </div>
                            </div>
                            {previewPercentage !== 0 && (
                              <>
                                <div className="text-center">
                                  <div className="text-muted-foreground">
                                    Diferença
                                  </div>
                                  <div
                                    className={`font-medium ${
                                      difference > 0
                                        ? "text-green-600"
                                        : difference < 0
                                        ? "text-red-600"
                                        : ""
                                    }`}
                                  >
                                    {difference > 0 ? "+" : ""}
                                    {formatPrice(difference)}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-muted-foreground">
                                    Novo
                                  </div>
                                  <div className="font-medium">
                                    {formatPrice(newPrice)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {index < products.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
