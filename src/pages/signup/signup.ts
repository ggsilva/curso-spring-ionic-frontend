import { ClienteService } from './../../services/domain/cliente.service';
import { CidadeDTO } from './../../models/cidade.dto';
import { CidadeService } from './../../services/domain/cidade.service';
import { EstadoService } from './../../services/domain/estado.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoDTO } from '../../models/estado.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public estadoService: EstadoService,
    public cidadeService: CidadeService,
    public clienteService: ClienteService,
    public alertController: AlertController
  ) {
    this.formGroup = formBuilder.group({
      nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
      tipo: ['1', [Validators.required]],
      cpfOuCnpj: ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha: ['123', [Validators.required]],
      logradouro: ['Rua Via', [Validators.required]],
      numero: ['25', [Validators.required]],
      complemento: ['Apto 3', []],
      bairro: ['Copacabana', []],
      cep: ['10828333', [Validators.required]],
      telefone1: ['977261827', [Validators.required]],
      telefone2: ['', []],
      telefone3: ['', []],
      estadoId: [null, [Validators.required]],
      cidadeId: [null, [Validators.required]]
    });
  }

  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(
        response => {
          this.estados = response;
          this.formGroup.controls.estadoId.setValue(null);
        },
        error => { });
  }

  updateCidades() {
    this.cidadeService.findAll(this.formGroup.value.estadoId)
      .subscribe(
        response => {
          this.cidades = response;
          this.formGroup.controls.cidadeId.setValue(null);
        },
        error => { });
  }

  signupUser() {
    let v = this.formGroup.value;
    let newCliente = {
      nome: v.nome,
      email: v.email,
      tipo: v.tipo,
      cpfOuCnpj: v.cpfOuCnpj,
      senha: v.senha,
      logradouro: v.logradouro,
      numero: v.numero,
      complemento: v.complemento,
      bairro: v.bairro,
      cep: v.cep,
      telefones: [v.telefone1, v.telefone2, v.telefone3],
      estadoId: v.telefones,
      cidadeId: v.cidadeId
    };

    this.clienteService.insert(newCliente)
      .subscribe(
        response => {
          this.showInsertOk();
        },
        error => { });
  }

  showInsertOk() {
    let alert = this.alertController.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
