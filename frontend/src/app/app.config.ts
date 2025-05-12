import { provideRouter } from '@angular/router';
import { HeyFormComponent } from '../app/hey-form/hey-form.component';

export const appConfig = {
  providers: [
    provideRouter([
      { path: '', component: HeyFormComponent },
    ]),
  ],
};
