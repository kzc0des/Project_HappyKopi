import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { loginGuard } from './core/guards/login-guard';
import { InventoryCategories } from './modules/inventory/inventory-categories/inventory-categories';
import { InventoryList } from './modules/inventory/inventory-list/inventory-list';
import { InventoryItemDetail } from './modules/inventory/inventory-item-detail/inventory-item-detail';
import { AddOrderModal } from './modules/pos/modal/add-order-modal/add-order-modal';
import { stockItemTypeCountResolver } from './modules/inventory/resolver/stockitemtype/stock-item-type-count-resolver';
import { stockItemSummaryResolver } from './modules/inventory/resolver/stockitemsummary/stock-item-summary-resolver';
import { TextBoxComponent } from './shared/components/text-box/text-box';
import { TextBoxPrice } from './shared/components/text-box-price/text-box-price';
import { AddIngredient } from './shared/components/add-ingredient/add-ingredient';
import { SearchDrink } from './shared/components/search-drink/search-drink';
import { ModifierPage } from './modules/modifiers/modifier-page/modifier-page';
import { DrinkListPage } from './modules/products/product-pages/drink-list-page/drink-list-page';
import { stockitemdetailResolver } from './modules/inventory/resolver/stockitemdetail/stockitemdetail-resolver';
import { DrinkDetailPage } from './modules/products/product-pages/drink-detail-page/drink-detail-page';
import { OrderQuickView } from './modules/pos/components/order-quick-view/order-quick-view'; 
import { Order } from './modules/pos/forms/order/order'; 
import { PosCategoryOff } from './modules/pos/components/pos-category-off/pos-category-off';
import { ViewOrder } from './modules/pos/forms/view-order/view-order';
import { CartItem } from './modules/pos/components/cart-item/cart-item';
import { YellowButton } from './shared/components/yellow-button/yellow-button';
import { Charge } from './modules/pos/forms/charge/charge';
import { ChargeSummary } from './modules/pos/forms/charge-summary/charge-summary';
import { AddDrinkPage } from './modules/products/product-pages/add-drink-page/add-drink-page';
import { InventoryAddItem } from './modules/inventory/inventory-add-item/inventory-add-item';
import { InventoryEditItem } from './modules/inventory/inventory-edit-item/inventory-edit-item';
import { EditDrinkPage } from './modules/products/product-pages/edit-drink-page/edit-drink-page';
import { EditProductsPage } from './modules/modifiers/edit-products-page/edit-products-page';
import { SaveDrinkComponent } from './shared/components/save-drink/save-drink';
import { modifierTypeCountResolver } from './modules/modifiers/resolver/modifiertypecount/modifiertype/modifier-type-count-resolver';
import { InventoryBatchView } from './modules/inventory/inventory-batch-view/inventory-batch-view';
import { stockItemBatchResolver } from './modules/inventory/resolver/stockitembatch/stock-item-batch-resolver';
import { ModifierList } from './modules/modifiers/modifier-list/modifier-list';
import { modifierSummaryResolver } from './modules/modifiers/resolver/modifiersummary/modifier-summary-resolver';
import { ModifierView } from './modules/modifiers/modifier-view/modifier-view';
import { modifierDetailsResolver } from './modules/modifiers/resolver/modifierdetails/modifier-details-resolver';
import { ModifierAdd } from './modules/modifiers/modifier-add/modifier-add';
import { ModifierEdit } from './modules/modifiers/modifier-edit/modifier-edit';
import { ConfirmationDialog } from './shared/components/confirmation-dialog/confirmation-dialog';
import { TestComponent } from './shared/components/test-component/test-component';
import { ChargeCashSummaryCard } from './modules/pos/components/charge-cash-summary-card/charge-cash-summary-card';
import { GrandeActive } from './modules/pos/components/grande-active/grande-active';
import { OrderCard } from './modules/pos/components/order-card/order-card';
import { OrderQuantityModifier } from './modules/pos/components/order-quantity-modifier/order-quantity-modifier';
import { PaymentMethodCash } from './modules/pos/components/payment-method-cash/payment-method-cash';
import { LongYellowButton } from './shared/components/long-yellow-button/long-yellow-button';
import { CategoriesListPage } from './modules/categories/categories-list-page/categories-list-page';
import { CategoriesListPageEdit } from './modules/categories/categories-list-page-edit/categories-list-page-edit';
import { CreateDrinkPage } from './modules/categories/create-drink-page/create-drink-page';
import { AssignDrinkPage } from './modules/categories/assign-drink-page/assign-drink-page';
import { EditCategoryPage } from './modules/categories/edit-category-page/edit-category-page';
import { categoriesListWithCountResolver } from './modules/categories/resolver/categorieswithcount/categories-list-with-count-resolver';
import { categoryWithCountResolver } from './modules/categories/resolver/categorywithcount/category-with-count-resolver';
import { TransactionIndividual } from './modules/transactions/forms/transaction-individual/transaction-individual';
import { DescriptionCard } from './shared/components/description-card/description-card';
import { TransactionHome } from './modules/transactions/forms/transaction-home/transaction-home';
import { TransactionPaymentCard } from './modules/transactions/components/transaction-payment-card/transaction-payment-card';
import { TransactionIndividualCard } from './modules/transactions/components/transaction-individual-card/transaction-individual-card';
import { TransactionCard } from './modules/transactions/components/transaction-card/transaction-card';
import { productsInCategoryResolver } from './modules/categories/resolver/productsincategory/products-in-category-resolver';
import { CategoryAdd } from './modules/categories/category-add/category-add';
import { AddAddonModal } from './modules/products/components/add-addon-modal/add-addon-modal';
import { AddIngredientModal } from './modules/products/components/add-ingredient-modal/add-ingredient-modal';
import { activeSizeResolver } from './modules/products/resolver/adddrinkresolvers/active-size-resolver';
import { activeAddonsResolver } from './modules/products/resolver/adddrinkresolvers/active-addons-resolver';
import { drinkCategoriesResolver } from './modules/products/resolver/adddrinkresolvers/drink-categories-resolver';
import { powderAndLiquidsIngredientsResolver } from './modules/products/resolver/adddrinkresolvers/powder-and-liquids-ingredients-resolver';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        canActivate: [loginGuard]
    },
    {
        path: 'app',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'inventory',
                pathMatch: 'full'
            },
            {
                path: 'inventory',
                children: [
                    {
                        path: '',
                        component: InventoryCategories,
                        pathMatch: 'full',
                        resolve: {
                            stockitemtypecount: stockItemTypeCountResolver
                        }
                    },
                    {
                        path: ':itemType/create',
                        component: InventoryAddItem
                    },
                    {
                        path: ':itemType/:itemId/edit',
                        component: InventoryEditItem,
                        resolve: {
                            stockitemdetail: stockitemdetailResolver
                        }
                    },
                    {
                        path: 'item/:itemid/batch/add',
                        component: InventoryBatchView
                    },
                    {
                        path: 'item/:itemid/batch/:batchid',
                        component: InventoryBatchView,
                        resolve: {
                            batchdetail: stockItemBatchResolver
                        }
                    },
                    {
                        path: ':itemType/:itemId',
                        component: InventoryItemDetail,
                        resolve: {
                            stockitemdetail: stockitemdetailResolver
                        }
                    },
                    {
                        path: ':itemType',
                        component: InventoryList,
                        resolve: {
                            stockitemlist: stockItemSummaryResolver
                        }
                    }
                ]
            },
            {
                path: 'modifiers',
                children: [
                    {
                        path: '',
                        component: ModifierPage,
                        pathMatch: 'full',
                        resolve: {
                            modifiertypecount: modifierTypeCountResolver
                        }
                    },
                    {
                        path: ':type/create',
                        component: ModifierAdd
                    },
                    {
                        path: ':type/:itemId/edit',
                        component: ModifierEdit,
                        resolve: {
                            modifierdetail: modifierDetailsResolver
                        }
                    },
                    {
                        path: ':type/:itemId',
                        component: ModifierView,
                        resolve: {
                            modifierdetail: modifierDetailsResolver
                        }
                    },                    
                    {
                        path: ':type',
                        component: ModifierList,
                        resolve: {
                            modifierlist: modifierSummaryResolver
                        }
                    }
                ]
            },
            {
                path: 'products',
                children: [
                    {
                        path: '',
                        component: DrinkListPage,
                        pathMatch: 'full'
                    },
                    {
                        path: 'filter',
                        component: CategoriesListPage
                    },
                    {
                        path: 'create',
                        component: AddDrinkPage,
                        resolve: {
                            sizes: activeSizeResolver,
                            categories: drinkCategoriesResolver,
                            ingredients: powderAndLiquidsIngredientsResolver,
                            addOns: activeAddonsResolver
                        }
                    }
                ]
            },
            {
                path: 'category',
                children: [
                    {
                        path: '',
                        component: CategoriesListPageEdit,
                        resolve: {
                            categorylist: categoriesListWithCountResolver
                        }
                    },
                    {
                        path: 'create',
                        component: CategoryAdd
                    },
                    {
                        path: ':categoryId/assign',
                        component: AssignDrinkPage,
                        resolve: {
                            products: productsInCategoryResolver 
                        }
                    },
                    {
                        path: ':categoryId',
                        component: EditCategoryPage,
                        resolve: {
                            categoryDetail: categoryWithCountResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path: 'textbox',
        component: TextBoxComponent
    },
    {
        path: 'textboxprice',
        component: TextBoxPrice
    },
    {
        path: 'addingredient',
        component: AddIngredient
    },
    {
        path: 'searchdrink',
        component: SearchDrink
    },
    {
        path: 'drink-list-page',
        component: DrinkListPage
    },
    {
        path: 'drink-detail/:id',
        component: DrinkDetailPage
    },
    {
        path: 'order-quick-view',
        component: OrderQuickView
    }, 
    {
        path: 'order',
        component: Order
    }, 
    {
        path: 'posoff',
        component: PosCategoryOff
    },
    {
        path: 'view-order',
        component: ViewOrder
    },
    {
        path: 'cart-item',
        component: CartItem
    },
    {
        path: 'order-modal',
        component: AddOrderModal
    },
    {
        path: 'yellow-btn',
        component: YellowButton
    },
    {
        path: 'charge',
        component: Charge
    },
    {
        path: 'charge-summary',
        component: ChargeSummary
    }, 
    {
        path: 'add-drink-page',
        component: AddDrinkPage
    },
    {
        path: 'edit-category',
        component: EditCategoryPage
    },
    {
        path: 'edit-drink-page',
        component: EditDrinkPage
    },
    {
        path: 'edit-products',
        component: EditProductsPage
    },
    {
        path: 'create-drink-page',
        component: CreateDrinkPage
    },
    {
        path: 'save-drink',
        component: SaveDrinkComponent
    },
    {
        path: 'assign-drink-page',
        component: AssignDrinkPage
    },
    {
        path: 'confirmation-dialog',
        component: ConfirmationDialog
    },
    {
        path: 'test-component',
        component: TestComponent
    },
    {
        path: 'charge-summary-card',
        component: ChargeCashSummaryCard
    },
    {
        path: 'grande',
        component: GrandeActive
    },
    {
        path: 'order-card',
        component: OrderCard
    },
    {
        path: 'oqm',
        component: OrderQuantityModifier
    },
    {
        path: 'payment-method',
        component: PaymentMethodCash
    },
    {
        path: 'long-yellow-btn',
        component: LongYellowButton
    },
    {
        path: 'transaction-card',
        component: TransactionCard
    },
    {
        path: 'transaction-indiv-card',
        component: TransactionIndividualCard
    },
    {
        path: 'transaction-payment-card',
        component: TransactionPaymentCard
    },
    {
        path: 'transaction-home',
        component: TransactionHome
    },
    {
        path: 'description-card',
        component: DescriptionCard
    },
    {
        path: 'transaction-individual',
        component: TransactionIndividual
    },
    {
        path: 'recipe-modal',
        component: AddIngredientModal
    }
    // save drink component
];
