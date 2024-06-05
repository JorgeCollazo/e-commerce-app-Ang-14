import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from "primeng/card";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import {CategoriesService, Category} from "@blueprint/products";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";

const _UX_MODULE = [
  CardModule, ToolbarModule, ButtonModule, TableModule, ToastModule, ConfirmDialogModule
]
@Component({
  selector: 'admin-categories-list',
  standalone: true,
  imports: [CommonModule, _UX_MODULE],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService){}

  ngOnInit() {
    this.getCategories();
  }

  openCategoryDialog() {
    this.router.navigate(['/categories-dialog']).then(r => {});
  }

  private getCategories() {         // It was declared private since it is not used anywhere else
    this.categoriesService.getCategories().subscribe(cats => {
      this.categories = cats;
    })
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Category?',
      header: 'Category Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully!' });
            this.getCategories();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category wasn\'t deleted!' });
          },
        });
      },
      reject: () => {}
    });
  }
  editCategory(categoryId: string) {
    this.router.navigateByUrl(`categories-dialog/${categoryId}`);   // Other ways could be using navigate method or routerLink in the HTML file
  }
}
