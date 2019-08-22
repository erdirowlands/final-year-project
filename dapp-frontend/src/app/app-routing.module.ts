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
    path: 'owner',
    loadChildren: './owner/owner.module#OwnerPageModule',
    // canLoad: [AuthGuard]
  },
  { path: 'qr', loadChildren: './qr/qr.module#QRPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
