import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InstitutionDetailsPage } from './institution-details.page';
import { CreateElectionComponent } from './create-election/create-election.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InstitutionDetailsPage, CreateElectionComponent],
  entryComponents: [CreateElectionComponent]
})
export class InstitutionDetailsPageModule {}
