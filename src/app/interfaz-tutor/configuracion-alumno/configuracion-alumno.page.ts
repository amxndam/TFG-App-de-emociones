import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Alumno } from 'src/app/models/alumno.model';
import { CamaraService } from 'src/app/services/camara.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-configuracion-alumno',
  templateUrl: './configuracion-alumno.page.html',
  styleUrls: ['./configuracion-alumno.page.scss'],
})
export class ConfiguracionAlumnoPage implements OnInit {

  alumno : Alumno; 
  alumnoId : number;
  public foto : string;
  public nombre : string;
  public formulario;
  

  constructor(private toast: ToastController, private db : DatabaseService, private formBuilder: FormBuilder, private actionSheetCtrl: ActionSheetController, public camaraService: CamaraService, private activatedRoute: ActivatedRoute, private router: Router) { }

  async ngOnInit() {

    this.activatedRoute.paramMap.subscribe(async params => {
      let alumnoId = params.get('alumnoId');
 
      await this.db.getAlumno(alumnoId).then(async data => {

        this.alumno = new Alumno(data.id, data.nombre, data.fotoPerfil);
        this.nombre = data.nombre;
        this.alumnoId = data.id;
      
        this.foto = data.fotoPerfil;
        if(this.foto == null || this.foto == '')
          this.foto = "../../assets/sinFoto.png";


      });
    });

    this.formulario = this.formBuilder.group({
      nombre: [this.nombre, [Validators.required, Validators.minLength(2)]]
   })


  }


  async enviarFormulario(){
    if (!this.formulario.valid) {

      let toast = await this.toast.create({
        message: 'Se debe de introducir todos los datos',
        duration: 3000
      });
      toast.present();

      return false;

    } 
    
    else
      await this.editarAlumno();
  }

  async editarAlumno(){

    this.nombre = this.formulario.value.nombre;
        
      const alumno = new Alumno(this.alumnoId, this.nombre, this.foto);
        
      this.db.updateAlumno(alumno).then(async _ => {
          //volvemos a la p??gina inicial del tutor
          await this.router.navigate(['..']);
      });
  }
  async eliminarAlumno(){

    await this.db.deleteAlumno(this.alumnoId).then(async _ => {
        //volvemos a la p??gina inicial del tutor
        await this.router.navigate(['./homepage-tutor']);
    });

  }

  async presentActionSheet() {

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Elige una opci??n',
      buttons: [{
        text: 'Galer??a',
        handler: async () => {
 
          await  this.camaraService.getGaleria().then(async (_) => {
         
            this.foto = await this.camaraService.imgURL;
           
          });
        }
        
      }, {
        text: 'C??mara',
        handler: async () => {

        await this.camaraService.getCamara().then(async (_) => {
          
          this.foto = await this.camaraService.imgURL;

          
        });

        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();

  }
  

}
