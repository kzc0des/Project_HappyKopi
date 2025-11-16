import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { loginGuard } from './core/guards/login-guard';
import { InventoryCategories } from './modules/inventory/inventory-categories/inventory-categories';
import { InventoryList } from './modules/inventory/inventory-list/inventory-list';
import { InventoryItemDetail } from './modules/inventory/inventory-item-detail/inventory-item-detail';
import { stockItemTypeCountResolver } from './modules/inventory/resolver/stockitemtype/stock-item-type-count-resolver';
import { stockItemSummaryResolver } from './modules/inventory/resolver/stockitemsummary/stock-item-summary-resolver';
import { ModifierPage } from './modules/modifiers/modifier-page/modifier-page';
import { DrinkListPage } from './modules/products/product-pages/drink-list-page/drink-list-page';
import { stockitemdetailResolver } from './modules/inventory/resolver/stockitemdetail/stockitemdetail-resolver';
import { DrinkDetailPage } from './modules/products/product-pages/drink-detail-page/drink-detail-page';
import { Order } from './modules/pos/forms/order/order';
import { ViewOrder } from './modules/pos/forms/view-order/view-order';
import { ChargeSummary } from './modules/pos/forms/charge-summary/charge-summary';
import { AddDrinkPage } from './modules/products/product-pages/add-drink-page/add-drink-page';
import { InventoryAddItem } from './modules/inventory/inventory-add-item/inventory-add-item';
import { InventoryEditItem } from './modules/inventory/inventory-edit-item/inventory-edit-item';
import { EditDrinkPage } from './modules/products/product-pages/edit-drink-page/edit-drink-page';
import { modifierTypeCountResolver } from './modules/modifiers/resolver/modifiertypecount/modifiertype/modifier-type-count-resolver';
import { InventoryBatchView } from './modules/inventory/inventory-batch-view/inventory-batch-view';
import { stockItemBatchResolver } from './modules/inventory/resolver/stockitembatch/stock-item-batch-resolver';
import { ModifierList } from './modules/modifiers/modifier-list/modifier-list';
import { modifierSummaryResolver } from './modules/modifiers/resolver/modifiersummary/modifier-summary-resolver';
import { ModifierView } from './modules/modifiers/modifier-view/modifier-view';
import { modifierDetailsResolver } from './modules/modifiers/resolver/modifierdetails/modifier-details-resolver';
import { ModifierAdd } from './modules/modifiers/modifier-add/modifier-add';
import { ModifierEdit } from './modules/modifiers/modifier-edit/modifier-edit';
import { CategoriesListPageEdit } from './modules/categories/categories-list-page-edit/categories-list-page-edit';
import { AssignDrinkPage } from './modules/categories/assign-drink-page/assign-drink-page';
import { EditCategoryPage } from './modules/categories/edit-category-page/edit-category-page';
import { categoriesListWithCountResolver } from './modules/categories/resolver/categorieswithcount/categories-list-with-count-resolver';
import { categoryWithCountResolver } from './modules/categories/resolver/categorywithcount/category-with-count-resolver';
import { TransactionIndividual } from './modules/transactions/forms/transaction-individual/transaction-individual';
import { TransactionHome } from './modules/transactions/forms/transaction-home/transaction-home';
import { productsInCategoryResolver } from './modules/categories/resolver/productsincategory/products-in-category-resolver';
import { CategoryAdd } from './modules/categories/category-add/category-add';
import { activeSizeResolver } from './modules/products/resolver/adddrinkresolvers/active-size-resolver';
import { activeAddonsResolver } from './modules/products/resolver/adddrinkresolvers/active-addons-resolver';
import { drinkCategoriesResolver } from './modules/products/resolver/adddrinkresolvers/drink-categories-resolver';
import { powderAndLiquidsIngredientsResolver } from './modules/products/resolver/adddrinkresolvers/powder-and-liquids-ingredients-resolver';
import { CategoriesResolver } from './modules/pos/resolver/categories/categories-resolver';
import { productDetailResolver } from './modules/products/resolver/productdetail/product-detail-resolver';
import { InventoryBatchAdd } from './modules/inventory/inventory-batch-add/inventory-batch-add';
import { transactionsResolver } from './modules/transactions/resolvers/transactions-resolver';
import { roleGuard } from './core/guards/role-guard';
import { ProductCategoriesPage } from './modules/products/product-pages/product-categories-page/product-categories-page';
import { RegisterBarista } from './modules/auth/register-barista/register-barista';
import { ModifierLink } from './modules/modifiers/modifier-link/modifier-link';
import { transactionIndivResolverResolver } from './modules/transactions/resolvers/transaction-indiv-resolver-resolver';

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
                path: 'inventory',
                canActivate: [roleGuard],
                data: {
                    roles: ['Admin']
                },
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
                        path: ':itemtype/:itemid/batch/add',
                        component: InventoryBatchAdd
                    },
                    {
                        path: ':itemType/:itemId/batch/:batchid',
                        component: InventoryBatchView,
                        resolve: {
                            batchdetail: stockItemBatchResolver,
                            stockitemdetail: stockitemdetailResolver
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
                canActivate: [roleGuard],
                data: {
                    roles: ['Admin']
                },
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
                        path: ':type/:itemId/edit/link/:itemType',
                        component: ModifierLink,
                        resolve: {
                            stockitemlist: stockItemSummaryResolver
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
                canActivate: [roleGuard],
                data: {
                    roles: ['Admin']
                },
                children: [
                    {
                        path: '',
                        component: DrinkListPage,
                        pathMatch: 'full'
                    },
                    {
                        path: 'category',
                        component: ProductCategoriesPage,
                        resolve: {
                            categorylist: categoriesListWithCountResolver
                        }
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
                    },
                    {
                        path: 'drink/:id',
                        component: DrinkDetailPage,
                        resolve: {
                            drink: productDetailResolver
                        }
                    },
                    {
                        path: 'drink/:id/edit',
                        component: EditDrinkPage,
                        resolve: {
                            drink: productDetailResolver,
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
                canActivate: [roleGuard],
                data: {
                    roles: ['Admin']
                },
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
                        path: ':categoryId/create',
                        component: AddDrinkPage,
                        resolve: {
                            sizes: activeSizeResolver,
                            categories: drinkCategoriesResolver,
                            ingredients: powderAndLiquidsIngredientsResolver,
                            addOns: activeAddonsResolver
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
            },
            {
                path: 'orders',
                canActivate: [roleGuard],
                data: {
                    roles: ['Barista']
                },
                children: [
                    {
                        path: '',
                        component: Order,
                        resolve: {
                            categories: CategoriesResolver
                        }
                    },
                    {
                        path: 'cart',
                        component: ViewOrder
                    },
                    {
                        path: 'summary',
                        component: ChargeSummary
                    }
                ]
            },
            {
                path: 'transactions',
                canActivate: [roleGuard],
                data: {
                    roles: ['Barista']
                },
                children: [
                    {
                        path: '',
                        component: TransactionHome,
                        resolve: {
                            transactions: transactionsResolver
                        }
                    },
                    {
                        path: ':id',
                        component: TransactionIndividual,
                        resolve: {
                            transaction: transactionIndivResolverResolver
                        }
                    }
                ]
            },
            {
                path: 'register-barista',
                canActivate: [roleGuard],
                data: {
                    roles: ['Admin']
                },
                component: RegisterBarista
            }
        ]
    }
];
