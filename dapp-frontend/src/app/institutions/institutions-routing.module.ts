import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsPage } from './institutions.page';

const routes: Routes = [
  {
    path: 'institution-tabs',
    component: InstitutionsPage,
    children: [
      {
        path: 'select-institution',
        children: [
          {
            path: '',
            loadChildren: './select-institution/select-institution.module#SelectInstitutionPageModule'
          },
          {
            path: ':institutionId',
            loadChildren:
              './select-institution/institution-details/institution-details.module#InstitutionDetailsPageModule'
          }
        ]
      },
      {
        path: 'submit-institution',
        children: [
          {
            path: '',
            loadChildren: './submit-institution/submit-institution.module#SubmitInstitutionPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/institutions/institution-tabs/select-institution',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/institutions/institution-tabs/select-institution',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionsRoutingModule {}
