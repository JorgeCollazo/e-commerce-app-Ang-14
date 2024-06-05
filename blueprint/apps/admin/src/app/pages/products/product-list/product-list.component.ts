import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Product, ProductService} from "@blueprint/products";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";


const _UX_MODULE = [
  CardModule, ToolbarModule, ButtonModule, TableModule, ToastModule, ConfirmDialogModule
]

@Component({
  selector: 'admin-product-list',
  standalone: true,
  imports: [CommonModule, _UX_MODULE],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})

export class ProductListComponent implements OnInit {

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  openProductDialog() {
    this.router.navigate(['/product-dialog']);
  }

  private getProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: () => {},
    })
  }
  deleteProduct(productID: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Product?',
      header: 'Product Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.productService.deleteProduct(productID).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully!' });
            this.getProducts();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product wasn\'t deleted!' });
          },
        });
      },
      reject: () => {}
    });
  }

  editProduct(productID: string) {
    this.router.navigateByUrl(`product-dialog/${productID}`).then(r => {})
  }

}

