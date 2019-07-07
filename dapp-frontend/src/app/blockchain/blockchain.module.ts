import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// TODO might not need this - unless I decide to create components directly in the blockchain folder, because services 
// not use the providedIn attribyte within the injectable decorator, that provides app wide access without needing to put
// them in modules.
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: []
})
export class BlockchainModule { }
