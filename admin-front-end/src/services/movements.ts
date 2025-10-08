import { api } from "@/lib/axios";
import type { TopMovementProducts, ProductMovement } from "@/types/movement";

export const movementsService = {
  getTopMovementProducts: async (): Promise<ProductMovement[]> => {
    const response = await api.get("/reports/top-movement-products");

    // Converte o objeto em array e ordena por movementCount
    const movementsArray = Object.values(response.data as TopMovementProducts);
    return movementsArray.sort((a, b) => b.movementCount - a.movementCount);
  },
};
