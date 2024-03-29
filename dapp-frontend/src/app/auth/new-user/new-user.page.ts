import { Component, OnInit } from '@angular/core';
import { NavParams,  ModalController} from '@ionic/angular';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {
  
  placeHolderImage = './assets/select-institutions/institution_item.png';

  constructor(private navParams: NavParams, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
