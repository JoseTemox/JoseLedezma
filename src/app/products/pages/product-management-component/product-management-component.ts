import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UrlFront } from '../../shared/globals-definitions/url-const';
import { ProductWebServices } from '../../services/product-web-services.service';
import {
  DeleteProductsResponse,
  Product,
} from '../../interfaces/products.interfaces';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModalService } from '../../components/global-modal-messages/services/global-modal-service.service';
import { DropDownMenu } from '../../components/drop-down-menu/drop-down-menu';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { SvgComponent } from '../../components/svg-component/svg-component';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-product-management-component',
  imports: [
    FormsModule,
    DropDownMenu,
    ReactiveFormsModule,
    SvgComponent,
    Footer,
  ],
  templateUrl: './product-management-component.html',
  styleUrl: './product-management-component.scss',
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly productWebServices = inject(ProductWebServices);
  private readonly globalModalService = inject(GlobalModalService);

  public isAdminMode = signal<boolean>(false);
  public products = signal<Product[]>([]);
  public pageData = signal<Product[]>([]);
  public productsFiltered = signal<Product[]>([]);

  private readonly onDestroy$ = new Subject<void>();

  isLoading = signal(false);

  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 15, 20];
  searchForm = this.fb.group({
    search: [''],
  });

  ngOnInit(): void {
    this.checkComponentMode();
    this.getAllProducts();

    this.searchListener();
  }
  searchListener() {
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value) => {
        this.handleSearch(value);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private handleSearch(searchTerm: string | null): void {
    const valueSearch = searchTerm?.toLocaleLowerCase() ?? '';

    if (valueSearch === '') {
      this.productsFiltered.set(this.products());
    } else {
      const filtered = this.products().filter((product) => {
        const name = product.name.toLocaleLowerCase();
        const description = product.description.toLocaleLowerCase();
        return name.includes(valueSearch) || description.includes(valueSearch);
      });
      this.productsFiltered.set(filtered);
    }
    this.calculatePagination();
  }

  getAllProducts() {
    this.isLoading.set(true);
    this.productWebServices
      .getProducts()
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((resp) => {
        this.totalItems = resp.data.length;
        this.products.set(resp.data);
        this.productsFiltered.set(resp.data);
        this.calculatePagination();
      });
  }

  calculatePagination() {
    this.totalItems = this.productsFiltered().length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pageData.update(() =>
      this.productsFiltered().slice(startIndex, endIndex)
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  get visibleItemsRange(): string {
    const startIndex = (this.currentPage - 1) * this.pageSize + 1;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.totalItems);
    return `${startIndex} - ${endIndex} de ${this.totalItems} resultados`;
  }

  pageSizeChange(event: any) {
    this.pageSize = parseInt(event.target.value, 10);
    this.calculatePagination();
  }

  checkComponentMode() {
    if (this.router.url.includes(UrlFront.ManageProduct)) {
      this.isAdminMode.set(true);
    }
  }

  newProduct() {
    this.router.navigate([UrlFront.NewProduct]);
  }

  onEditProduct(product: Product | undefined): void {
    this.router.navigate([`/${UrlFront.EditProduct}`, product?.id], {
      state: product,
    });
  }

  onDeleteProduct(product: Product | undefined): void {
    this.globalModalService
      .confirm(`¿Estás seguro de eliminar el product ${product?.name}?`)
      .pipe(
        take(1),
        switchMap((resp) => {
          if (!resp.confirmed) {
            return of();
          }
          return this.productWebServices
            .deleteProduct(product?.id)
            .pipe(take(1));
        }),
        switchMap((resp: DeleteProductsResponse | null) => {
          if (resp?.message && typeof resp.message === 'string') {
            return this.globalModalService
              .success('Producto borrado')
              .pipe(take(1));
          }
          return of(null);
        })
      )
      .subscribe(() => this.getAllProducts());
  }
}
