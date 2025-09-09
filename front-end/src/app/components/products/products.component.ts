import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ProductService,
  Product,
  InsertProductRequest,
  UpdateProductRequest,
  ProductUrl,
} from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  form!: FormGroup;
  products = signal<Product[]>([]);
  isFormVisible = signal(false);
  isEditing = signal(false);
  currentProduct = signal<Product | null>(null);
  errorMessage = signal<string>('');

  get urls(): FormArray {
    return this.form.get('urls') as FormArray;
  }

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      targetPrice: [null],
      urls: this.fb.array([this.createUrlGroup()]),
    });
    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createUrlGroup(): FormGroup {
    return this.fb.group({
      storeId: [1, Validators.required],
      url: ['', Validators.required],
    });
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
    this.form.reset({
      name: '',
      targetPrice: null,
      urls: this.fb.array([this.createUrlGroup()]),
    });
    this.isFormVisible.set(true);
  }

  showUpdateForm(product: Product) {
    this.isEditing.set(true);

    this.productService.getProductById(product.id).subscribe({
      next: (data) => {
        this.currentProduct.set(data);
        this.form.patchValue({
          name: data.name,
          targetPrice: data.targetPrice,
        });

        this.urls.clear();
        if (data.urls && data.urls.length > 0) {
          data.urls.forEach((url) => {
            this.urls.push(this.fb.group(url));
          });
        } else {
          this.urls.push(this.createUrlGroup());
        }

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

  addUrl() {
    this.urls.push(this.createUrlGroup());
  }

  removeUrl(index: number) {
    this.urls.removeAt(index);
  }

  onSubmit() {
    if (this.isEditing()) {
      this.updateProduct();
    } else {
      this.insertProduct();
    }
  }

  insertProduct() {
    this.productService.insertProduct(this.form.value).subscribe({
      next: () => {
        this.loadProducts();
        this.hideForm();
      },
      error: (error) => {
        this.errorMessage.set(error);
      },
    });
  }

  updateProduct() {
    if (this.currentProduct()) {
      this.productService.updateProduct(this.currentProduct()!.id, this.form.value).subscribe({
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
