import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsPage } from './institutions.page';

const routes: Routes = [
  {
    path: 'institutions-tabs',
    component: InstitutionsPage,
    children: [
      {
        path: ' select-institution',
        children: [
          {
            path: '',
            loadChildren:
              './select-institution/select-institution.module#SelectInstitutionPageModule'
          },
          {
              path: ':institutionId',
              loadChildren: './select-institution/institution-details/institution-details.module#InstitutionDetailsPageModule'
          }
        ]
      }
    ]
  },
  { path: 'submit-institution', loadChildren: './submit-institution/submit-institution.module#SubmitInstitutionPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionsRoutingModule {}
