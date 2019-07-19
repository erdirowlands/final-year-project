import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SubmitInstitutionPage } from './submit-institution.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitInstitutionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SubmitInstitutionPage]
})
export class SubmitInstitutionPageModule {}
