import { Component, OnInit } from '@angular/core';
import { InstitutionContractService } from 'src/app/blockchain/contracts/institution-contract/institution-contract.service';
import { NavController } from '@ionic/angular';
import { Institution } from './institution.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-institution-details',
  templateUrl: './institution-details.page.html',
  styleUrls: ['./institution-details.page.scss'],
})
export class InstitutionDetailsPage implements OnInit {

  constructor(private institutionContract: InstitutionContractService, private navController: NavController,     private route: ActivatedRoute,
    private router: Router) { }

  institution: Institution;
  
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('address')) {
        this.navController.navigateBack('/institutions/tabs/view');
        return;
      }
    this.institutionContract.generateContractAbstraction(paramMap.get('address'));
  });
  }
}
