import { Route } from '@angular/router';
import {ShellComponent} from "./shared/shell/shell.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {CategoriesListComponent} from "./pages/categories/categories-list/categories-list.component";
import {CategoriesDialogComponent} from "./pages/categories/categories-dialog/categories-dialog.component";
import {ProductDialogComponent} from "./pages/products/product-dialog/product-dialog.component";
import {ProductListComponent} from "./pages/products/product-list/product-list.component";
import {UserListComponent} from "./pages/users/user-list/user-list.component";
import {UserDialogComponent} from "./pages/users/user-dialog/user-dialog.component";

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },

      { path: 'categories-list', component: CategoriesListComponent },
      { path: 'categories-dialog', component: CategoriesDialogComponent },
      { path: 'categories-dialog/:id', component: CategoriesDialogComponent },

      { path: 'product-list', component: ProductListComponent },
      { path: 'product-dialog', component: ProductDialogComponent },
      { path: 'product-dialog/:id', component: ProductDialogComponent },

      { path: 'users-list', component: UserListComponent },
      { path: 'users-dialog', component: UserDialogComponent },
      { path: 'users-dialog/:id', component: UserDialogComponent },
    ]
  }
];
