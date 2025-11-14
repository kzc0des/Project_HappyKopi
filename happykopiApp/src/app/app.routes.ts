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
import { CategoriesResolver } from './modules/pos/resolver/categories/categories-resolver';
import { productsListResolver } from './modules/products/resolver/productslist/products-list-resolver';
import { productDetailResolver } from './modules/products/resolver/productdetail/product-detail-resolver';
import { InventoryBatchAdd } from './modules/inventory/inventory-batch-add/inventory-batch-add';
import { ChargeItem } from './modules/pos/components/charge-item/charge-item';
import { transactionsResolver } from './modules/transactions/resolvers/transactions-resolver';
import { roleGuard } from './core/guards/role-guard';
import { ProductCategoriesPage } from './modules/products/product-pages/product-categories-page/product-categories-page';
import { RegisterBarista } from './modules/auth/register-barista/register-barista';
import { ModifierLink } from './modules/modifiers/modifier-link/modifier-link';
import { transactionIndivResolverResolver } from './modules/transactions/resolvers/transaction-indiv-resolver-resolver';
import { TransactionDrinkListItem } from './modules/transactions/components/transaction-drink-list-item/transaction-drink-list-item';

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
        component: Order,
        resolve: {
            categories: CategoriesResolver
        }

    },
    {
        path: 'posoff',
        component: PosCategoryOff
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
        component: TransactionPaymentCard,
        resolve: {
            transactions: transactionsResolver
        }
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
        path: 'transactions-individual/:id',
        component: TransactionIndividual
    },
    {
        path: 'recipe-modal',
        component: AddIngredientModal
    },
    {
        path: 'charge-item',
        component: ChargeItem
    },
    {
        path: 'transaction-drink-list-item',
        component: TransactionDrinkListItem
    }
];
