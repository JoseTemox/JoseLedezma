import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UrlFront } from '../../shared/globals-definitions/url-const';
import { ProductDropDownMenu } from '../../components/product-drop-down-menu/product-drop-down-menu';
import { ProductWebServices } from '../../services/product-web-services.service';
import { Product } from '../../interfaces/products.interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-management-component',
  imports: [ProductDropDownMenu, FormsModule],
  templateUrl: './product-management-component.html',
  styleUrl: './product-management-component.scss',
})
export class ProductManagementComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly productWebServices = inject(ProductWebServices);

  public isAdminMode = signal<boolean>(false);
  public products = signal<Product[]>([]);
  public pageData = signal<Product[]>([]);
  public productsFiltered = signal<Product[]>([]);

  // pageData: Product[] = []
  pageSize = 5;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.checkComponentMode();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productWebServices.getProducts().subscribe((resp) => {
      this.totalItems = resp.data.length;
      this.products.set(resp.data);
      this.calculatePagination();
    });
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    this.paginate();

    // this.products.set(data);
    // this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pageData.update(() => this.products().slice(startIndex, endIndex));
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
    if (!this.router.url.includes(UrlFront.ViewProduct)) {
      console.log('Etra aqui');
      this.isAdminMode.set(true);
    }
  }

  newProduct() {
    this.router.navigate([UrlFront.NewProduct]);
  }

  showResultBy(number: number) {
    console.log('-------', number);
  }
}
