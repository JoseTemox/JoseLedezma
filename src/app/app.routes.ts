import { Routes } from '@angular/router';
import { ProductContainer } from './products/components/product-container/product-container';
import { UrlFront } from './products/shared/globals-definitions/url-const';

export const routes: Routes = [
  {
    path: '',
    component: ProductContainer,
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './products/pages/product-management-component/product-management-component'
          ).then((m) => m.ProductManagementComponent),
      },
      {
        path: `${UrlFront.NewProduct}`,
        loadComponent: () =>
          import(
            './products/pages/product-form-component/product-form-component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: `${UrlFront.EditProduct}/:idProduct`,
        loadComponent: () =>
          import(
            './products/pages/product-form-component/product-form-component'
          ).then((m) => m.ProductFormComponent),
      },
      {
        path: `${UrlFront.ManageProduct}`,
        loadComponent: () =>
          import(
            './products/pages/product-management-component/product-management-component'
          ).then((m) => m.ProductManagementComponent),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
