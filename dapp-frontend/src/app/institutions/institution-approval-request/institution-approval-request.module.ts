import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionApprovalRequestPage]
})
export class InstitutionApprovalRequestPageModule {}
