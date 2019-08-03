import { API_CONFIG } from './../../config/api.config';
import { ClienteService } from './../../services/domain/cliente.service';
import { ClienteDTO } from './../../models/cliente.dto';
import { StorageService } from './../../services/storage.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageService: StorageService,
    public clienteService: ClienteService
  ) { }

  ionViewDidLoad() {
    let user = this.storageService.getLocalUser()
    if (user && user.email)
      this.clienteService.findByEmail(user.email)
        .subscribe(
          response => {
            this.cliente = response;
            this.getImageIfExists();
          },
          error => {
            if (error.status == 403)
              this.navCtrl.setRoot('HomePage');
          });
    else
      this.navCtrl.setRoot('HomePage');
    console.log('ionViewDidLoad ProfilePage');
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(
        response => {
          this.cliente.imgUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        },
        error => { });
  }

}
