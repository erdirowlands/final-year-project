import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { InstitutionApprovalRequestPage } from './institution-approval-request.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionApprovalRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionApprovalRequestPage]
})
export class InstitutionApprovalRequestPageModule {}
