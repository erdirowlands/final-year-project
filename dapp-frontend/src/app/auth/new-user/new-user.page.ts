import { Component, OnInit } from '@angular/core';
import { NavParams,  } from '@ionic/angular';



@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {

  constructor(private navParams: NavParams) { }

  ngOnInit() {
  }

  closePopover() {
    //this.popOverCtrl.dismiss();
  }

}
