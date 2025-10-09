import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
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
import { lowStockService } from "@/services/lowStock";
import type { LowStockProduct } from "@/types/lowStock";

export function LowStock() {
  const [lowStockData, setLowStockData] = useState<LowStockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLowStockProducts = async () => {
    try {
      setIsLoading(true);
      const data = await lowStockService.getBelowMinStock();
      setLowStockData(data);
    } catch (error) {
      console.error("Erro ao carregar produtos com estoque baixo:", error);
      toast.error("Erro ao carregar produtos com estoque baixo");
    } finally {
      setIsLoading(false);
    }
  };

  const getOutOfStockCount = () => {
    return lowStockData.filter((item) => item.quantityInStock === 0).length;
  };

  const getCriticalStockCount = () => {
    return lowStockData.filter(
      (item) =>
        item.quantityInStock > 0 &&
        item.quantityInStock <= item.minStockQuantity * 0.5
    ).length;
  };

  const getStockPercentage = (current: number, min: number) => {
    if (min === 0) return 100;
    return Math.min((current / min) * 100, 100);
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0)
      return { label: "SEM ESTOQUE", color: "text-red-600", bg: "bg-red-50" };
    if (current <= min * 0.3)
      return { label: "CRÍTICO", color: "text-red-500", bg: "bg-red-50" };
    if (current <= min * 0.6)
      return { label: "BAIXO", color: "text-orange-500", bg: "bg-orange-50" };
    return { label: "ATENÇÃO", color: "text-yellow-600", bg: "bg-yellow-50" };
  };

  const getSeverityIcon = (current: number, min: number) => {
    if (current === 0) return "🔴";
    if (current <= min * 0.3) return "🟠";
    if (current <= min * 0.6) return "🟡";
    return "⚠️";
  };

  useEffect(() => {
    loadLowStockProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando produtos com estoque baixo...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Estoque Baixo</h1>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total com Estoque Baixo
            </CardTitle>
            <AlertTriangle className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lowStockData.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertCircle className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {getOutOfStockCount()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estoque Crítico
            </CardTitle>
            <TrendingDown className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getCriticalStockCount()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Produtos com Estoque Baixo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockData.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-green-600 mb-2">
                Parabéns! Nenhum produto com estoque baixo
              </h3>
              <p className="text-muted-foreground">
                Todos os produtos estão com estoque acima do mínimo recomendado.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Estoque Atual</TableHead>
                  <TableHead className="text-center">Estoque Mínimo</TableHead>
                  <TableHead className="text-center">Diferença</TableHead>
                  {/* <TableHead className="w-32">Nível</TableHead> */}
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockData
                  .sort((a, b) => {
                    // Ordena por criticidade: sem estoque primeiro, depois por percentual
                    if (a.quantityInStock === 0 && b.quantityInStock > 0)
                      return -1;
                    if (b.quantityInStock === 0 && a.quantityInStock > 0)
                      return 1;
                    return (
                      getStockPercentage(
                        a.quantityInStock,
                        a.minStockQuantity
                      ) -
                      getStockPercentage(b.quantityInStock, b.minStockQuantity)
                    );
                  })
                  .map((item, index) => {
                    const status = getStockStatus(
                      item.quantityInStock,
                      item.minStockQuantity
                    );
                    const difference =
                      item.minStockQuantity - item.quantityInStock;

                    return (
                      <TableRow key={index} className={status.bg}>
                        <TableCell className="text-center text-lg">
                          {getSeverityIcon(
                            item.quantityInStock,
                            item.minStockQuantity
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${status.color}`}>
                            {item.quantityInStock.toLocaleString("pt-BR")}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.minStockQuantity.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-red-600">
                            -{difference.toLocaleString("pt-BR")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${status.color} ${status.bg}`}
                          >
                            {status.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
