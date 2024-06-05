import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CategoriesService, Category} from "@blueprint/products";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {ColorPickerModule} from "primeng/colorpicker";
import {timer} from "rxjs";

const _UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  InputTextModule,
  FormsModule,
  ReactiveFormsModule,
  ToastModule,
  ColorPickerModule
]

@Component({
  selector: 'admin-categories-dialog',
  standalone: true,
  imports: [CommonModule, _UX_MODULE],
  templateUrl: './categories-dialog.component.html',
  styleUrl: './categories-dialog.component.css',
})

export class CategoriesDialogComponent implements OnInit {

  form!: FormGroup;
  isSubmitted: boolean = false;
  editMode: boolean = false;
  currentCategoryID: string = '';

  get categoryForm() {              // This get method was written like this to shorten the syntax in the view
    return this.form.controls;
  }

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private categoryService: CategoriesService,
    private location: Location,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm() {
    this.form = this.fb.group({
      name:['', Validators.required],
      icon:['', Validators.required],
      color:['#FFF'],
    })
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    const category: Category = {
      id: this.currentCategoryID,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value,
      color: this.categoryForm['color'].value,
    }
    if(this.editMode) {
      this.editCategory(category);
    } else {
      this.createCategory(category);
    }
  }

  private checkEditMode() {       // Method to check and initialize the form fields
    this.route.params.subscribe(params => {
      if(params['id']) {               // id is the wild card you used before in the route ('categories-dialog/:id')
        this.editMode = true;
        this.currentCategoryID = params['id'];
        this.categoryService.getCategory(params['id']).subscribe(category => {
          this.categoryForm['name'].setValue(category.name);
          this.categoryForm['icon'].setValue(category.icon);
          this.categoryForm['color'].setValue(category.color);
        })
      }
    })
  }

  goBack() {
    this.location.back();
  }

  createCategory(category: Category) {
    this.categoryService.createCategory(category).subscribe({
      next: (category) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${category.name} created!` });
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Category ${category.name} wasn\'t created!` });
      },
    });
  }

  editCategory(category: Category) {
    this.categoryService.editCategory(category).subscribe({
      next: (category  ) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${category.name} updated!` });
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Category ${category.name} wasn\'t updated!` });
      },
    });
  }
}
