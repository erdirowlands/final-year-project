import { Component, OnInit } from '@angular/core';
const electionArtifact = require('../blockchain/contracts/artifacts/Election.json')

@Component({
  selector: 'app-elections',
  templateUrl: './elections.page.html',
  styleUrls: ['./elections.page.scss'],
})
export class ElectionsPage implements OnInit {

  electionAbstraction: any;
  description: string;
  address: string;
  candidates: string[];

  openingTime: string;
  closingTime: string;



  constructor() { }

  ngOnInit() {

  }

}
