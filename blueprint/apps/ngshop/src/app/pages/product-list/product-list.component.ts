import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blueprint-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {}
