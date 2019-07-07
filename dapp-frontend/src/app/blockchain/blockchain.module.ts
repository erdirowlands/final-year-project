import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3ProviderService } from "./provider/web3provider.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [Web3ProviderService]
})
export class BlockchainModule { }
