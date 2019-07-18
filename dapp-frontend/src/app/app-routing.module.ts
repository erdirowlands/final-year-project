import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'institutions', loadChildren: './institutions/institutions.module#InstitutionsPageModule' },
  { path: 'elections', loadChildren: './elections/elections.module#ElectionsPageModule' },
  { path: 'discover', loadChildren: './elections/discover/discover.module#DiscoverPageModule' },
  { path: 'discover', loadChildren: './institutions/discover/discover.module#DiscoverPageModule' },
  { path: 'create-institution', loadChildren: './institutions/create-institution/create-institution.module#CreateInstitutionPageModule' },
  { path: 'create-election', loadChildren: './elections/create-election/create-election.module#CreateElectionPageModule' },
  { path: 'account', loadChildren: './account/account.module#AccountPageModule' },
  { path: 'election-details', loadChildren: './elections/discover/election-details/election-details.module#ElectionDetailsPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
