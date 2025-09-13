import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductService, Product, ProductRequest } from '../../services/product.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import Swal from 'sweetalert2';

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
    this.productService
      .getProductById(product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.isEditing.set(true);
          this.currentProduct.set(data);
          this.isFormVisible.set(true);
          this.errorMessage.set('');
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Error while loading product: ${error.message ?? 'Undefined error'}`,
          });
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
    this.productService
      .insertProduct(productData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadProducts();
          this.hideForm();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Error while inserting product: ${error.message ?? 'Undefined error'}`,
          });
        },
      });
  }

  updateProduct(productData: ProductRequest) {
    if (this.currentProduct()) {
      this.productService
        .updateProduct(this.currentProduct()!.id, productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.hideForm();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Error while updating product: ${error.message ?? 'Undefined error'}`,
            });
          },
        });
    }
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
          },
          error: (error) => {
            this.errorMessage.set(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `Error while deleting product: ${error.message ?? 'Undefined error'}`,
            });
          },
        });
      }
    });
  }
}
