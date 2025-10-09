import { useState, useEffect } from "react";
import { Package, TrendingUp, AlertTriangle, PackageCheck } from "lucide-react";
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
import { stockService } from "@/services/stock";
import type { StockBalance } from "@/types/stock";

export function Stock() {
  const [stockData, setStockData] = useState<StockBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStockBalance = async () => {
    try {
      setIsLoading(true);
      const data = await stockService.getStockBalance();
      setStockData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório de estoque:", error);
      toast.error("Erro ao carregar relatório de estoque");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getTotalValue = () => {
    return stockData.reduce((total, item) => total + item.totalValue, 0);
  };

  const getTotalItems = () => {
    return stockData.reduce((total, item) => total + item.quantityInStock, 0);
  };

  const getProductsCount = () => {
    return stockData.length;
  };

  const getProductsWithoutStock = () => {
    return stockData.filter((item) => item.quantityInStock === 0).length;
  };

  useEffect(() => {
    loadStockBalance();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando relatório de estoque...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Relatório de Estoque</h1>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total do Estoque
            </CardTitle>
            <TrendingUp className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(getTotalValue())}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Itens
            </CardTitle>
            <PackageCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTotalItems().toLocaleString("pt-BR")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Cadastrados
            </CardTitle>
            <Package className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getProductsCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Sem Estoque
            </CardTitle>
            <AlertTriangle className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {getProductsWithoutStock()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">
                  Quantidade em Estoque
                </TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                stockData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`${
                          item.quantityInStock === 0
                            ? "text-red-600 font-semibold"
                            : item.quantityInStock <= 10
                            ? "text-amber-600 font-semibold"
                            : ""
                        }`}
                      >
                        {item.quantityInStock.toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(item.totalValue)}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {stockData.length > 0 && (
                <TableRow className="border-t-2 font-semibold bg-muted/50">
                  <TableCell>TOTAL GERAL</TableCell>
                  <TableCell className="text-center">
                    {getTotalItems().toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatPrice(getTotalValue())}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
