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
import { TextBoxComponent } from './shared/components/text-box/text-box';
import { TextBoxPrice } from './shared/components/text-box-price/text-box-price';
import { AddIngredient } from './shared/components/add-ingredient/add-ingredient';
import { SearchDrink } from './shared/components/search-drink/search-drink';
import { ModifierPage } from './modules/modifiers/modifier-page/modifier-page';
import { ProductPage} from './modules/products/product-page/product-page';
import { DrinkListPage } from './modules/products/drink-list-page/drink-list-page';
import { CategoriesListPage } from './modules/products/categories-list-page/categories-list-page';
import { stockitemdetailResolver } from './modules/inventory/resolver/stockitemdetail/stockitemdetail-resolver';
import { DrinkDetailPage } from './modules/products/drink-detail-page/drink-detail-page';
import { dashboardRedirectGuard } from './core/guards/dashboard-redirect-guard';
import { OrderQuickView } from './modules/pos/components/order-quick-view/order-quick-view';
import { OrderQuickViewDown } from './modules/pos/components/order-quick-view-down/order-quick-view-down';
import { Order } from './modules/pos/forms/order/order';
import { PosCategoryOn } from './modules/pos/components/pos-category-on/pos-category-on';
import { PosCategoryOff } from './modules/pos/components/pos-category-off/pos-category-off';
import { SizesPage } from './modules/modifiers/sizes-page/sizes-page'
import { AddOnsPage } from './modules/modifiers/add-ons-page/add-ons-page'



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
                        path: '',
                        pathMatch: 'full',
                        component: DashboardHost,
                        canActivate: [dashboardRedirectGuard]
                    },
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
        component: BatchOrganizerCard
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
        path: 'product-page',
        component: ProductPage
    },
    {
        path: 'drink-list-page',
        component: DrinkListPage
    },
    {
        path: 'categories-list-page',
        component: CategoriesListPage
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
        path:'order-quick-view-down',
        component: OrderQuickViewDown
    },
    {
        path: 'order',
        component: Order
    },
    {
        path: 'poson',
        component: PosCategoryOn
    },
    {
        path: 'posoff',
        component: PosCategoryOff
    },
    {
        path:'modifier-page',
        component: ModifierPage
    },
    {
        path:'sizes',
        component: SizesPage
    },
    {
        path:'addons',
        component: AddOnsPage
    }

];
