import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionContractPage } from './institution-contract.page';

const routes: Routes = [
  {
    path: '',
    component: InstitutionContractPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionContractPage]
})
export class InstitutionContractPageModule {}
