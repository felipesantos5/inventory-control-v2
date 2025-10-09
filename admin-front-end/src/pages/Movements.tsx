import { useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { movementsService } from "@/services/movements";
import type { TopMovementProducts } from "@/types/movement";

export function Movements() {
  const [movementsData, setMovementsData] =
    useState<TopMovementProducts | null>(null);
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
    if (!movementsData) return 0;
    return (
      movementsData.topEntryProduct.movementCount +
      movementsData.topExitProduct.movementCount
    );
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
          <RefreshCw className="mr-2 h-5 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Movimentações
            </CardTitle>
            <Activity className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalMovements().toLocaleString("pt-BR")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entradas Registradas
            </CardTitle>
            <ArrowUp className="h-5 w-5text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {movementsData?.topEntryProduct.movementCount.toLocaleString(
                "pt-BR"
              ) || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saídas Registradas
            </CardTitle>
            <ArrowDown className="h-5 w-5text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {movementsData?.topExitProduct.movementCount.toLocaleString(
                "pt-BR"
              ) || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo de Movimentos
            </CardTitle>
            <TrendingUp className="h-5 w-5text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                (movementsData?.topEntryProduct.movementCount || 0) >=
                (movementsData?.topExitProduct.movementCount || 0)
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {movementsData
                ? (movementsData.topEntryProduct.movementCount -
                    movementsData.topExitProduct.movementCount >
                  0
                    ? "+"
                    : "") +
                  (
                    movementsData.topEntryProduct.movementCount -
                    movementsData.topExitProduct.movementCount
                  ).toLocaleString("pt-BR")
                : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards dos Produtos Top */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Produto com Mais Entradas */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <ArrowUp className="h-5 w-5" />
              Produto com Mais Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movementsData?.topEntryProduct ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    {movementsData.topEntryProduct.productName}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <ArrowUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {movementsData.topEntryProduct.movementCount}
                    </span>
                    <span className="text-green-700">entradas</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Status:</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      🥇 Líder em Entradas
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-green-600">
                Nenhuma entrada registrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produto com Mais Saídas */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ArrowDown className="h-5 w-5" />
              Produto com Mais Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movementsData?.topExitProduct ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">📤</div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    {movementsData.topExitProduct.productName}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <ArrowDown className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">
                      {movementsData.topExitProduct.movementCount}
                    </span>
                    <span className="text-red-700">saídas</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">Status:</span>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      🥇 Líder em Saídas
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-red-600">
                Nenhuma saída registrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Comparativo de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {movementsData ? (
            <div className="space-y-6">
              {/* Barras de Comparação */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700 flex items-center gap-2">
                      <ArrowUp className="h-5 w-4" />
                      Entradas: {movementsData.topEntryProduct.productName}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {movementsData.topEntryProduct.movementCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (movementsData.topEntryProduct.movementCount /
                            Math.max(
                              movementsData.topEntryProduct.movementCount,
                              movementsData.topExitProduct.movementCount
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700 flex items-center gap-2">
                      <ArrowDown className="h-5 w-4" />
                      Saídas: {movementsData.topExitProduct.productName}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {movementsData.topExitProduct.movementCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (movementsData.topExitProduct.movementCount /
                            Math.max(
                              movementsData.topEntryProduct.movementCount,
                              movementsData.topExitProduct.movementCount
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Insight</h4>
                  <p className="text-sm text-blue-700">
                    {movementsData.topEntryProduct.movementCount >
                    movementsData.topExitProduct.movementCount
                      ? "Mais entradas que saídas indicam crescimento do estoque."
                      : movementsData.topEntryProduct.movementCount <
                        movementsData.topExitProduct.movementCount
                      ? "Mais saídas que entradas podem indicar alta demanda."
                      : "Entradas e saídas equilibradas indicam fluxo estável."}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">
                    📊 Recomendação
                  </h4>
                  <p className="text-sm text-amber-700">
                    {movementsData.topExitProduct.movementCount >
                    movementsData.topEntryProduct.movementCount
                      ? `Monitore o estoque de "${movementsData.topExitProduct.productName}" para evitar ruptura.`
                      : `"${movementsData.topEntryProduct.productName}" está com boa reposição de estoque.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum dado de movimentação disponível
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
