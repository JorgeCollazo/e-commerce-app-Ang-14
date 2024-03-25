import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {ProductListComponent} from "./pages/product-list/product-list.component";
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";
import {BannerComponent} from "@blueprint/ui"; // imported from the index.ts file (check tsconfig.base.json)

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    HomePageComponent,
    ProductListComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent
  ],
  selector: 'blueprint-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngshop';
}



