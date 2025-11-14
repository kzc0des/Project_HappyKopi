import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderInventoryService {
  /**
   * -------------------------------------------------------
   * 1. Calculate how much of each ingredient the drink needs
   * -------------------------------------------------------
   * productConfig.Ingredients is assumed to be:
   * [
   *   { IngredientId: 1, Variants: [{ SizeId: 1, Amount: 100 }, ...] },
   *   { IngredientId: 2, Variants: [...] },
   * ]
   */
  calculateIngredientUsage(productConfig: any, sizeId: number): Record<number, number> {
    const usage: Record<number, number> = {};

    if (!productConfig?.Ingredients) return usage;

    for (const ing of productConfig.Ingredients) {
      const variant = ing.Variants?.find((v: any) => v.SizeId === sizeId);

      if (variant) {
        usage[ing.IngredientId] = variant.Amount;
      }
    }

    return usage;
  }

  /**
   * -------------------------------------------------------
   * 2. Multiply ingredient usage * quantity
   * -------------------------------------------------------
   */
  calculateTotalRequired(ingredientUsage: Record<number, number>, quantity: number) {
    const total: Record<number, number> = {};

    for (const ingId in ingredientUsage) {
      total[ingId] = ingredientUsage[ingId] * quantity;
    }

    return total;
  }

  /**
   * -------------------------------------------------------
   * 3. Check how many servings can be made with inventory
   * -------------------------------------------------------
   */
  calculateRemainingStock(ingredientUsage: Record<number, number>, inventory: any): number {
    if (!inventory) return 0;

    let maxServings = Infinity;

    for (const ingId in ingredientUsage) {
      const required = ingredientUsage[ingId];
      const stock = inventory[ingId] ?? 0;

      const possible = Math.floor(stock / required);

      if (possible < maxServings) {
        maxServings = possible; // min() across all ingredients
      }
    }

    return maxServings === Infinity ? 0 : maxServings;
  }

  /**
   * -------------------------------------------------------
   * 4. Calculate maxQuantity for a drink
   *    considering:
   *       • product ingredients
   *       • size
   *       • actual inventory
   *       • items already in the basket
   *       • exclude active item (for edit mode)
   * -------------------------------------------------------
   */
  calculateMaxQuantity(
    productConfig: any,
    sizeId: number,
    currentOrders: any[],
    activeItem: any = null
  ): number {
    const ingredientUsage = this.calculateIngredientUsage(productConfig, sizeId);

    // Build current basket ingredient usage
    const inventoryUsed: Record<number, number> = {};

    for (const order of currentOrders) {
      // skip if this is the item being edited
      if (activeItem && order.Id === activeItem.Id) continue;

      // get usage per size of that order
      const orderUsage = this.calculateIngredientUsage(order.Config, order.SizeId);
      const totalOrderUsage = this.calculateTotalRequired(orderUsage, order.Quantity);

      // accumulate
      for (const ingId in totalOrderUsage) {
        inventoryUsed[ingId] = (inventoryUsed[ingId] || 0) + totalOrderUsage[ingId];
      }
    }

    // Calculate remaining inventory after subtracting basket usage
    const remainingInventory: Record<number, number> = {};

    if (productConfig?.Inventory) {
      if (productConfig?.Inventory) {
        for (const ingId in productConfig.Inventory) {
          const id = Number(ingId);

          const starting = productConfig.Inventory[id] ?? 0;
          const used = inventoryUsed[id] ?? 0;

          remainingInventory[id] = Math.max(0, starting - used);
        }
      }
    }

    return this.calculateRemainingStock(ingredientUsage, remainingInventory);
  }

  /**
   * -------------------------------------------------------
   * 5. Enforce quantity cap
   * -------------------------------------------------------
   */
  enforceQuantityLimit(newQty: number, maxQty: number) {
    if (newQty > maxQty) {
      return { qty: maxQty, capped: true };
    }
    return { qty: newQty, capped: false };
  }
}
