import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {}
