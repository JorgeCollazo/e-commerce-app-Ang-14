import {ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {provideHttpClient, withFetch} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()),provideRouter(appRoutes), MessageService, ConfirmationService, provideAnimations()],
};
