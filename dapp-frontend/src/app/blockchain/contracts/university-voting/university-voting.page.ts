import { Component, OnInit } from '@angular/core';
import { UniversityVotingService } from './university-voting.service';

@Component({
  selector: 'app-university-voting',
  templateUrl: './university-voting.page.html',
  styleUrls: ['./university-voting.page.scss']
})
export class UniversityVotingPage implements OnInit {
  constructor(private universityVotingContract: UniversityVotingService) {}

  deployedUniversityVotingContract: any;

  async ngOnInit() {
    this.deployedUniversityVotingContract = await this.universityVotingContract.universityVoting.deployed();
  }

  async submitNewInstitutions() {}

  async getInstitutions() {}
}
