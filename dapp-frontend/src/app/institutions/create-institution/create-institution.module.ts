import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateInstitutionPage } from './create-institution.page';

const routes: Routes = [
  {
    path: '',
    component: CreateInstitutionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateInstitutionPage]
})
export class CreateInstitutionPageModule {}
