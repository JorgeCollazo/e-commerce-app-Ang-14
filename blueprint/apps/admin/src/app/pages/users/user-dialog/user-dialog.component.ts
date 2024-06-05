import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {InputTextModule} from "primeng/inputtext";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {DropdownModule} from "primeng/dropdown";
import {User, UsersService} from "@blueprint/users";
import {timer} from "rxjs";
import {MessageService} from "primeng/api";
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;

const _UX_MODULES = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  ToastModule,
  FormsModule,
  ReactiveFormsModule,
  InputTextModule,
  InputMaskModule,
  InputSwitchModule,
  DropdownModule
]
interface Country {
  id: string;
  name: string;
}

@Component({
  selector: 'blueprint-user-dialog',
  standalone: true,
  imports: [CommonModule, _UX_MODULES],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
})
export class UserDialogComponent {

  currentUserID: string = '';
  editMode: boolean = false;
  form!: FormGroup;
  isSubmitted: boolean = false;
  countries: Country[] = [];

  get userForm() {                  // This get method was written like this to shorten the syntax in the view
    return this.form.controls;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UsersService,
    private messageService: MessageService,
    private location: Location
    ) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.getCountries();
  }

  initializeForm() {
    this.form = this.fb.group({
      name:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
      phone:['', Validators.required],
      street:[''],
      apartment:[''],
      city:[''],
      zip:[''],
      country:[''],
      isAdmin:[false],
    })
  }

  private checkEditMode() {       // Method to check and initialize the form fields
    this.route.params.subscribe(params => {
      if (params['id']) {               // id is the wild card you used before in the route ('categories-dialog/:id')
        this.editMode = true;
        this.currentUserID = params['id'];
        this.userService.getUser(params['id']).subscribe( {
          next: (user: User) => {
            this.userForm['name'].setValue(user.name);
            this.userForm['email'].setValue(user.email);
            this.userForm['isAdmin'].setValue(user.isAdmin);
            this.userForm['street'].setValue(user.street);
            this.userForm['apartment'].setValue(user.apartment);
            this.userForm['zip'].setValue(user.zip);
            this.userForm['phone'].setValue(user.phone);
            this.userForm['city'].setValue(user.city);
            this.userForm['country'].setValue(user.country);
            this.userForm['password'].setValidators([]);
            this.userForm['password'].updateValueAndValidity();

          },
          error: () => {}
        })
      }
    })
  }

  onSubmit() {

    this.isSubmitted = true;

    if(this.form.invalid) {
      return;
    }
    const user: User = {
      id: this.currentUserID,
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      isAdmin: this.userForm['isAdmin'].value,
      street: this.userForm['street'].value,
      apartment: this.userForm['apartment'].value,
      zip: this.userForm['zip'].value,
      phone: this.userForm['phone'].value,
      city: this.userForm['city'].value,
      country: this.userForm['country'].value,
    }
    if(this.editMode) {
      this.editUser(user);
    } else {
      this.createUser(user);
    }
  }

  private createUser(user: User) {
    this.userService.createUser(user).subscribe({
      next: (user) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} created!` });
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `User ${user.name} wasn\'t created!` });
      },
    });
  }

  private editUser(user: User) {
    this.userService.editUser(user).subscribe({
      next: (user  ) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `User ${user.name} updated!` });
        timer(2000).subscribe( done => {
          this.location.back();
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `User ${user.name} wasn\'t updated!` });
      },
    });
  }

  private getCountries() {
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    this.countries = Object.entries(countriesLib.getNames('en', {select: 'official'})).map((entry) => { // this return a multidimensional array of the form [['es', Spain],['en', England]...]
      return {    // So you'll transform it in objects like this
        id: entry[0],
        name: entry[1]
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

