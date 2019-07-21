import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'institutions', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  {
    path: 'institutions',
    loadChildren: './institutions/institutions.module#InstitutionsPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'elections',
    loadChildren: './elections/elections.module#ElectionsPageModule',
    canLoad: [AuthGuard]
  },
  { path: 'election-details', loadChildren: './elections/all-elections/election-details/election-details.module#ElectionDetailsPageModule' },
  { path: 'institution-contract', loadChildren: './blockchain/contracts/institution-contract/institution-contract.module#InstitutionContractPageModule' },
  { path: 'election-contract', loadChildren: './blockchain/contracts/election-contract/election-contract.module#ElectionContractPageModule' },
  { path: 'university-voting', loadChildren: './blockchain/contracts/university-voting/university-voting.module#UniversityVotingPageModule' },
  { path: 'owner', loadChildren: './owner/owner.module#OwnerPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
