import { DatabaseService, Dev } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {
 
  developers: Dev[] = [];
 
  products: Observable<any[]>;
 
  developer : Dev;
  product = {name: '', creator:  ''};
  nombreDev : string;
  skillsDev : string;
 
  

  selectedView = 'devs';
 
  constructor(private db: DatabaseService) { }
 
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        })
        this.products = this.db.getProducts();
      }
    });
  }
 
  addDeveloper() {

    let skills = this.skillsDev['split'](',');
    skills = skills.map(skill => skill.trim());
 
    this.db.addDeveloper(this.nombreDev, skills, null)
    .then(_ => {
   
    });
  }
 
  addProduct() {
    this.db.addProduct(this.product.name, this.product.creator)
    .then(_ => {
    
    });
  }
 
}