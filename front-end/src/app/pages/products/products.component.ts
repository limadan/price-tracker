import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product, ProductRequest } from '../../services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products = signal<Product[]>([]);
  isFormVisible = signal(false);
  isEditing = signal(false);
  currentProduct = signal<Product | null>(null);
  errorMessage = signal<string>('');

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  loadProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
  }

  showInsertForm() {
    this.isEditing.set(false);
    this.currentProduct.set(null);
    this.isFormVisible.set(true);
  }

  showUpdateForm(product: Product) {
    this.productService.getProductById(product.id).subscribe({
      next: (data) => {
        this.isEditing.set(true);
        this.currentProduct.set(data);
        this.isFormVisible.set(true);
        this.errorMessage.set('');
      },
      error: (error) => {
        this.errorMessage.set(error);
      },
    });
  }

  hideForm() {
    this.isFormVisible.set(false);
    this.errorMessage.set('');
  }

  onFormSubmit(productData: ProductRequest) {
    if (this.isEditing()) {
      this.updateProduct(productData);
    } else {
      this.insertProduct(productData);
    }
  }

  insertProduct(productData: ProductRequest) {
    this.productService.insertProduct(productData).subscribe({
      next: () => {
        this.loadProducts();
        this.hideForm();
      },
      error: (error) => {
        this.errorMessage.set(error);
      },
    });
  }

  updateProduct(productData: ProductRequest) {
    if (this.currentProduct()) {
      this.productService.updateProduct(this.currentProduct()!.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.hideForm();
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
    }
  }
}
