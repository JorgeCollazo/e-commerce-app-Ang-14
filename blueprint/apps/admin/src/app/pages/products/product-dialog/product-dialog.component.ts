import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from "primeng/inputswitch";
import {DropdownModule} from "primeng/dropdown";
import {CategoriesService, Category, Product, ProductService} from "@blueprint/products";
import {EditorModule} from "primeng/editor";
import {timer} from "rxjs";
import {MessageService} from "primeng/api";
import {ActivatedRoute} from "@angular/router";

const _UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  InputTextModule,
  FormsModule,
  ReactiveFormsModule,
  ToastModule,
  InputNumberModule,
  InputTextareaModule,
  InputSwitchModule,
  DropdownModule,
  EditorModule
]

@Component({
  selector: 'admin-product-dialog',
  standalone: true,
  imports: [CommonModule, _UX_MODULE],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css',
})
export class ProductDialogComponent implements OnInit {

  editMode: boolean = false;
  isSubmitted: boolean = false;
  form!: FormGroup;
  categories: Category[] = [];
  imageDisplay: string | ArrayBuffer = '';
  currentProductId: string = '';

  get productForm() {                            // This get method was written like this to shorten the syntax in the view
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private messageService: MessageService,     // From PrimeNG
    private location: Location,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit() {
    this.initializeForm();
    this.getCategories();
    this.checkEditMode();
  }

  initializeForm() {
    this.form = this.fb.group({
      name:['', Validators.required],
      brand:['', Validators.required],
      price:['', Validators.required],
      category:['', Validators.required],
      countInStock:['', Validators.required],
      description:['', Validators.required],
      richDescription:[''],
      image:['', Validators.required],
      isFeatured:[false],
    })
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe(
      {
        next: (categories: Category[]) => {
          this.categories = categories;
        },
        error: () => {}
      })
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);   // To create it dynamically
    })
    if(this.editMode) {
      this.updateProduct(productFormData);
    } else {
      this.addProduct(productFormData);
    }
  }

  goBack() {
    this.location.back();
  }

  onImageUpload(event: any) { // If you were force the parameter to be of type Event, you'll have to do it like this:
    const file = event.target.files[0];  // (event.target as HTMLInputElement).files?.[0];
    if(file) {
    this.form.patchValue({image: file})     //  Is typically used for partial updates when you only want to modify specific form controls without triggering validation. setValue is used when you want to update all form controls and trigger validation for the entire form.
      this.form.get('image')?.updateValueAndValidity();   // By default, Angular automatically performs validation when a form control value changes or when a form is submitted. However, in some cases, you may need to manually trigger validation, such as when updating the value programmatically. The updateValueAndValidity method allows you to do that.
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string;  // In this video it worked without using type assertion
      }
      fileReader.readAsDataURL(file);
    }
  }

  private addProduct(formDataProduct: FormData) {
    this.productService.createProduct(formDataProduct).subscribe({
      next: (product: Product) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} was created!`});
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Product wasn\'t created!`});
      },
    });
  }

  private updateProduct(formDataProduct: FormData) {
    this.productService.editProduct(formDataProduct, this.currentProductId).subscribe({
      next: (product: Product  ) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} updated!` });
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: (product: Product) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Product ${product.name} wasn\'t updated!` });
      },
    });
  }

  private checkEditMode() {
    this.route.params.subscribe(params => {
      if(params['id']) {               // id is the wild card you used before in the route ('product-dialog/:id')
        this.editMode = true;
        this.currentProductId = params['id'];
        this.productService.getProduct(params['id']).subscribe(product => {
          console.log(product);
          this.productForm['name'].setValue(product.name);
          this.productForm['category'].setValue(product.category);
          this.productForm['brand'].setValue(product.brand);
          this.productForm['price'].setValue(product.price);
          this.productForm['countInStock'].setValue(product.countInStock);
          this.productForm['isFeatured'].setValue(product.isFeatured);
          this.productForm['description'].setValue(product.description);
          this.productForm['richDescription'].setValue(product.richDescription);
          this.imageDisplay = product.image as string;
          this.productForm['image'].setValidators([]);
          this.productForm['image'].updateValueAndValidity();
        })
      }
    })
  }
}
