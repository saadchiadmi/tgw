import { Component, OnInit } from '@angular/core';
import { ExcelDataService } from '../services/excel-data.service';
import {Subscription, Observable, of} from 'rxjs';
import * as  XLSX from 'xlsx'
import { Data } from '../entities/data';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private excelDatatServices : ExcelDataService) { }
  data : Data[];
  filteredData : Data[];
  dechets : SelectItem[]= []; selectedDechets: string[] = [];
  type_collecte : string[];
  years : SelectItem[]= []; selectedYear : number;
  yearsLoop : SelectItem[]= [];
  mounths : SelectItem[] = []; selectedMounth : number;
  sites : SelectItem[]= []; selectedSites : string;
  raisons : SelectItem[]= []; selectedRaison : string;
  busy: Subscription;
  dechetClo = [{ field: 'dechets', header: 'Chiffres en Kg' }];
  ngOnInit() {
    this.excelDatatServices.getData().then(res => {
      this.data = res;
      console.log(this.data);
    });
    
  }

  setData(){
    this.filteredData = this.data;
    this.type_collecte = this.data.map(d => d.Type_collecte).filter((value, index, self) => self.indexOf(value) === index).sort();
    this.data.map(d => d.Annee).filter((value, index, self) => self.indexOf(value) === index).forEach(y => this.years.push({label: '' + y, value: y}));
    for (let i = 1; i < 13; i++) {
        this.mounths.push({label: '' + i, value: i});
    }
    this.data.map(d => d.Dechet).filter((value, index, self) => self.indexOf(value) === index).sort().forEach(s => this.dechets.push({label: '' + s, value: s}));
    this.data.map(d => d.Site).filter((value, index, self) => self.indexOf(value) === index).forEach(s => this.sites.push({label: '' + s, value: s}));
    this.data.map(d => d.RS_client).filter((value, index, self) => self.indexOf(value) === index).forEach(rs => this.raisons.push({label: '' + rs, value: rs}));
    this.yearsLoop=this.years;
  }

  filtre(){
    if(this.selectedYear) {
      this.years=[{label: '' + this.selectedYear, value: this.selectedYear}]
    }
    this.filteredData = this.data.filter(d => d.RS_client===this.selectedRaison).filter(d=>d.Annee===this.selectedYear);
    console.log(this.filteredData)
  }

  someOfMounth(dechet : string, mounth : number, year : number): string{
    return this.filteredData.filter(d => d.Dechet===dechet).filter(d => d.Mois == mounth).filter(d => d.Annee == year)
                      .reduce((sum, current) => sum + current.Quantite, 0).toFixed(2);
  }

  someOfYear(dechet : string, year : number): string{
    return this.filteredData.filter(d => d.Dechet===dechet).filter(d => d.Annee == year)
                      .reduce((sum, current) => sum + current.Quantite, 0).toFixed(2);
  }

}
