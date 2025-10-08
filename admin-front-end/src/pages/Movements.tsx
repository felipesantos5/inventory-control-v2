import { useState, useEffect } from "react";
import { Activity, TrendingUp, Package, BarChart3, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { movementsService } from "@/services/movements";
import type { ProductMovement } from "@/types/movement";

export function Movements() {
  const [movementsData, setMovementsData] = useState<ProductMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMovements = async () => {
    try {
      setIsLoading(true);
      const data = await movementsService.getTopMovementProducts();
      setMovementsData(data);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
      toast.error("Erro ao carregar movimentações");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalMovements = () => {
    return movementsData.reduce((total, item) => total + item.movementCount, 0);
  };

  const getAverageMovements = () => {
    if (movementsData.length === 0) return 0;
    return Math.round(getTotalMovements() / movementsData.length);
  };

  const getTopProduct = () => {
    if (movementsData.length === 0) return null;
    return movementsData[0];
  };

  const getProductsWithMovements = () => {
    return movementsData.filter((item) => item.movementCount > 0).length;
  };

  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "��";
      default:
        return `${index + 1}º`;
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando movimentações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movimentações de Produtos</h1>
        <Button onClick={loadMovements} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Movimentações</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getTotalMovements().toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos com Movimento</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getProductsWithMovements()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Produto</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageMovements().toLocaleString("pt-BR")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto Mais Movimentado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-green-600">{getTopProduct()?.productName || "Nenhum"}</div>
            <div className="text-lg font-bold">{getTopProduct()?.movementCount.toLocaleString("pt-BR") || "0"} mov.</div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ranking de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Posição</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Movimentações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Nenhuma movimentação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                movementsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-medium">
                      <span className="text-lg">{getRankingIcon(index)}</span>
                    </TableCell>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-semibold ${
                          index === 0 ? "text-green-600" : index === 1 ? "text-blue-600" : index === 2 ? "text-orange-600" : "text-gray-600"
                        }`}
                      >
                        {item.movementCount.toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card de Insights */}
      {movementsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">Produtos Mais Ativos</h4>
                <div className="space-y-1">
                  {movementsData.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.productName}</span>
                      <span className="font-medium">{item.movementCount} mov.</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-amber-600">Produtos Menos Ativos</h4>
                <div className="space-y-1">
                  {movementsData
                    .slice(-3)
                    .reverse()
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.productName}</span>
                        <span className="font-medium">{item.movementCount} mov.</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
