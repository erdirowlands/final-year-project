import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectInstitutionPage } from './select-institution.page';

const routes: Routes = [
  {
    path: '',
    component: SelectInstitutionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectInstitutionPage]
})
export class SelectInstitutionPageModule {}
