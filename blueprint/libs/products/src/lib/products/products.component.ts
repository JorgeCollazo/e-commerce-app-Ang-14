import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blueprint-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {}
