import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { TrainingSearchComponent} from './pages/TrainingSearchComponent/trainingsearch.component';
import { ProfileComponent } from './pages/profile/profile.component';
export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: TrainingSearchComponent,
        pathMatch: 'full',
        title: 'Dovelink'
      },
           {
        path: 'search',
        component: TrainingSearchComponent,
        title: 'Dovelink'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Dovelink'
      },
    ]
  },

];
