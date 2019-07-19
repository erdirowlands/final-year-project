import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstitutionsPage } from './institutions.page';
import { InstitutionsRoutingModule } from './institutions-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstitutionsRoutingModule
  ],
  declarations: [InstitutionsPage]
})
export class InstitutionsPageModule {}
