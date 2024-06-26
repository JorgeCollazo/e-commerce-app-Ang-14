import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blueprint-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent {}
