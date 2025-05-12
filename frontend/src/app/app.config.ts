import { provideRouter } from '@angular/router';
import { HeyFormComponent } from '../app/hey-form/hey-form.component';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig = {
  providers: [
    provideRouter([
      { path: '', component: HeyFormComponent },
    ]), provideClientHydration(withEventReplay()),
  ],
};
