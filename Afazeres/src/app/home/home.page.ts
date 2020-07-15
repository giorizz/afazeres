import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listTasks: any[] = [];
  constructor(private alertCtl : AlertController, private toastCtrl : ToastController, private actionSheet : ActionSheetController) {
    let taskStorage = localStorage.getItem('taskdb')
    if(taskStorage != null){
      this.listTasks = JSON.parse(taskStorage);
    }
  }

    async showAdd() {
      const alert = await this.alertCtl.create({
        header: 'Digite a sua tarefa:',
        inputs: [
          {
            name: 'taskRead',
            type: 'text',
            placeholder: 'Tarefa'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Adicionar',
            handler: (form) => {
              this.add(form.taskRead)
            }
          }
        ]
      });
  
      await alert.present();
    }

    //valida o campo adicionar vazio
    async add(taskRead : string){
      if(taskRead.trim().length == 0){
        const toast = await this.toastCtrl.create({
          message : "Você precisa digitar uma tarefa",
          duration: 1500,
          position: 'middle',
        });
        toast.present();
        return;
      }

      let task = {name : taskRead, done: false}
      this.listTasks.push(task);
      this.savedLocalStorage();
    }
    savedLocalStorage(){
      localStorage.setItem('taskdb', JSON.stringify(this.listTasks))
    }

    async openAction(task : any){
      const actionSheet = await this.actionSheet.create({
        buttons: [{
          text: task.done ? 'Desmarcar Tarefa' :  'Concluir Tarefa',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;

            this.savedLocalStorage();
          }
        },
         {
          text: 'Cancelar',
          icon: 'close',
          handler: () => {
          }
        }]
      });
      await actionSheet.present();
    }

    remove(task : any){
      this.listTasks = this.listTasks.filter(taskArray => task != taskArray);
      this.savedLocalStorage()
    }
  }

