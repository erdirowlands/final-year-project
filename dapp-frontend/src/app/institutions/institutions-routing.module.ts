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
            path: 'new-institution',
            loadChildren:
              './institution-approval-request/institution-approval-request.module#InstitutionApprovalRequestPageModule'
          }
        ]
      },
      {
        path: 'elections',
        children: [
          {
            path: '',
            loadChildren: '../elections/elections.module#ElectionsPageModule'
          },
          {
            path: 'new-election',
            redirectTo: '../elections/create-election/create-election.module/CreateElectionPageModule',
            pathMatch: 'full'
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
  },
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
