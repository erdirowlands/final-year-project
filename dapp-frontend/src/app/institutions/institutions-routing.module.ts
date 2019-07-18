import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsPage } from './institutions.page';

const routes: Routes = [
  {
    path: 'institutions-tabs',
    component: InstitutionsPage,
    children: [
      {
        path: ' all-instiutions',
        children: [
          {
            path: '',
            loadChildren:
              './all-institutions/all-institutions.module#AllInstitutionsPageModule'
          }
          {
              path: ''
          }
        ]
      }
    ]
  },
  { path: 'institution-details', loadChildren: './all-institutions/institution-details/institution-details.module#InstitutionDetailsPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild()],
  exports: [RouterModule]
})
export class InstitutionsRoutingModule {}
