import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminDashboard } from './modules/dashboard/admin-dashboard/admin-dashboard';
import { roleGuard } from './core/guards/role-guard';
import { BaristaDashboard } from './modules/dashboard/barista-dashboard/barista-dashboard';
import { DashboardHost } from './modules/dashboard/dashboard-host/dashboard-host';
import { loginGuard } from './core/guards/login-guard';
import { InventoryCategories } from './modules/inventory/inventory-categories/inventory-categories';
import { InventoryList } from './modules/inventory/inventory-list/inventory-list';
import { InventoryItemDetail } from './modules/inventory/inventory-item-detail/inventory-item-detail';
import { BatchOrganizerCard } from './modules/inventory/components/batch-organizer-card/batch-organizer-card';
import { InventoryCategoryCard } from './modules/inventory/components/inventory-category-card/inventory-category-card';
import { AddOrderModal } from './modules/pos/modal/add-order-modal/add-order-modal';
import { stockItemTypeCountResolver } from './modules/inventory/resolver/stockitemtype/stock-item-type-count-resolver';
import { IngredientBatchCard } from './modules/inventory/components/ingredient-batch-card/ingredient-batch-card';
import { IngredientInputCard } from './modules/products/components/ingredient-input-card/ingredient-input-card';
import { stockItemSummaryResolver } from './modules/inventory/resolver/stockitemsummary/stock-item-summary-resolver';
import { ModifierPage } from './modules/modifiers/modifier-page/modifier-page';
import { ProductPage} from './modules/products/product-page/product-page';
import { DrinkListPage } from './modules/products/drink-list-page/drink-list-page';
import { CategoriesListPage } from './modules/products/categories-list-page/categories-list-page'

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
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardHost,
                children: [
                    {
                        path: 'admin',
                        component: AdminDashboard,
                        canActivate: [roleGuard],
                        data: { roles: ['Admin'] }
                    },
                    {
                        path: 'barista',
                        component: BaristaDashboard,
                        canActivate: [roleGuard],
                        data: { roles: ['Barista'] }
                    }
                ]
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
                        path: ':itemType',
                        component: InventoryList,
                        resolve: {
                            stockitemlist: stockItemSummaryResolver
                        }
                    },
                    {
                        path: 'item/:itemId',
                        component: InventoryItemDetail,
                        resolve: {
                            stockitemdetail: stockitemdetailResolver
                        }
                    }
                ] 
            }
        ]
    },
    {
        path: 'sample',
        component: ProductPage
    },
    {
        path: 'drink-list-page',
        component: DrinkListPage
    },
    {
        path: 'categories-list-page',
        component: CategoriesListPage
    }
];
