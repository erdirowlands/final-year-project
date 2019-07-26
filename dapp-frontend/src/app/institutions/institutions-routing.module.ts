import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionsPage } from './institutions.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: InstitutionsPage,
    children: [
      {
        path: 'view',
        children: [
          {
            path: '',
            loadChildren: './select-institution/select-institution.module#SelectInstitutionPageModule'
          },
          {
            path: 'new',
            loadChildren: '../elections/create-election/create-election.module#CreateElectionPageModule',
          },
          {
            path: 'request',
            loadChildren: './institution-approval-request/institution-approval-request.module#InstitutionApprovalRequestPageModule',
          },
          {
            path: 'elections',
            loadChildren: '../elections/elections.module#ElectionsPageModule',
          },
          {
            path: ':address',
            loadChildren:
              './select-institution/institution-details/institution-details.module#InstitutionDetailsPageModule'
          },
        ]
      },
      { 
        path: '',
        redirectTo: '/institutions/tabs/view',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/institutions/tabs/view',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InstitutionsRoutingModule {}
