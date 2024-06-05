import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {User, UsersService} from "@blueprint/users";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {TagModule} from "primeng/tag";
import * as countriesLib from "i18n-iso-countries";

declare const require: any;

const _UX_MODULES = [
  ToastModule,
  ConfirmDialogModule,
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  TagModule
]

@Component({
  selector: 'admin-user-list',
  standalone: true,
  imports: [CommonModule, _UX_MODULES],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})

export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private router: Router,
    private userService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) {
  }

  ngOnInit() {
    this.getUsers();
  }

  openUserDialog() {
    this.router.navigate(['/users-dialog']).then(r => {});
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this User?',
      header: 'User Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully!' });
            this.getUsers();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User wasn\'t deleted!' });
          },
        });
      },
      reject: () => {}
    });
  }

  editUser(userId:string) {
    this.router.navigateByUrl(`users-dialog/${userId}`).then(r => {});
  }

  private getUsers() {
    this.userService.getUsers().subscribe(
      {
        next: (users) => {
          this.users = users;
        },
        error: (err: any) => {}
      }
    )
  }

  getCountryName(countryKey: string) {
    if (countryKey) return this.userService.getCountry(countryKey);
    return '';
  }
}
