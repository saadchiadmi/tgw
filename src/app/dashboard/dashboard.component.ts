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
  type_collecte : string[]; selectedType: string[] = [];
  years : SelectItem[]= []; selectedYear : string='';
  yearsLoop : SelectItem[]= [];
  mounthLoop : SelectItem[]= [];
  mounths : SelectItem[] = []; selectedMounth : string='';
  sites : SelectItem[]= []; selectedSites : string='';
  raisons : SelectItem[]= []; selectedRaison : string='';
  busy: Subscription;
  dechetClo = [{ field: 'dechets', header: 'Chiffres en Kg' }];
  ngOnInit() {
    // this.excelDatatServices.getData();
    this.setData();
    console.log(this.data);
  }

  setData(){
    var rec = new XMLHttpRequest();
    rec.open("GET","assets/DATA.xls", true)
    rec.responseType= "arraybuffer";
    let result : Data[];
    rec.onload = (e) => {
      var arraybuffer = rec.response;
      var data = new Uint8Array(arraybuffer);
      var ar = new Array();
      for(var i =0 ; i != data.length;i++){
        ar[i] = String.fromCharCode(data[i]);
      }
      var bstr = ar.join("");
      var workbook = XLSX.read(bstr,{type:"binary"});
      var first_sheet = workbook.SheetNames[0];
      var workSheet = workbook.Sheets[first_sheet];
      this.data = XLSX.utils.sheet_to_json(workSheet,{raw : true})
      this.filteredData = this.data;
      this.raisons.push({label: 'Toutes les raisons', value: ''})
      this.sites.push({label: 'Tous les sites', value: ''})
      this.yearsLoop.push({label: 'Toutes les années', value: ''})
      this.mounthLoop.push({label: 'Tous les mois', value: ''})
      this.data.map(d => d.Dechet).filter((value, index, self) => self.indexOf(value) === index).sort().forEach(s => this.dechets.push({label: '' + s, value: s}));
      this.type_collecte = this.data.map(d => d.Type_collecte).filter((value, index, self) => self.indexOf(value) === index).sort();
      this.data.map(d => d.Annee).filter((value, index, self) => self.indexOf(value) === index).forEach(y => this.years.push({label: '' + y, value: y}));
      for (let i = 1; i < 13; i++) {
          this.mounths.push({label: '' + i, value: i});
      }
      this.data.map(d => d.Site).filter((value, index, self) => self.indexOf(value) === index).forEach(s => this.sites.push({label: '' + s, value: s}));
      this.data.map(d => d.RS_client).filter((value, index, self) => self.indexOf(value) === index).forEach(rs => this.raisons.push({label: '' + rs, value: rs}));
      this.years.forEach(y => this.yearsLoop.push(y));
      this.mounths.forEach(m => this.mounthLoop.push(m));
      this.selectedDechets= this.dechets.map(d => d.value);
    }
    rec.send();
    
  }

  filter(){
    this.filteredData=this.data;
    if(this.selectedYear!='') {
      this.years=[{label: '' + this.selectedYear, value: this.selectedYear}];
      this.filteredData = this.filteredData.filter(d=>d.Annee==this.selectedYear);
    }else{
      this.years=[];
      this.yearsLoop.filter(yl => yl.value!="").forEach(yl => this.years.push(yl));
    }
    if(this.selectedRaison!='') {
      this.filteredData = this.filteredData.filter(d => d.RS_client==this.selectedRaison);
    }
    if(this.selectedMounth!='') {
      this.filteredData = this.filteredData.filter(d => d.Mois==this.selectedMounth);
    }
    if(this.selectedSites!='') {
      this.filteredData = this.filteredData.filter(d => d.Site==this.selectedSites);
    }
    if(this.selectedDechets.length>0) {
      this.filteredData = this.filteredData.filter(d => this.selectedDechets.includes(d.Dechet));
    }
    if(this.selectedType.length>0) {
      this.filteredData = this.filteredData.filter(d => this.selectedType.includes(d.Type_collecte));
    }
    
    console.log(this.filteredData)
  }

  changeCheckbox(checked: boolean, type : string){
    if(checked) this.selectedType.push(type);
    else this.selectedType = this.selectedType.filter(t=> t!=type);
    console.log(this.selectedType)
  }

  someOfMounth(dechet : string, mounth : string, year : string): string{
    return this.filteredData.filter(d => d.Dechet===dechet).filter(d => d.Mois == mounth).filter(d => d.Annee == year)
                      .reduce((sum, current) => sum + current.Quantite, 0).toFixed(2);
  }

  someOfYear(dechet : string, year : string): string{
    return this.filteredData.filter(d => d.Dechet===dechet).filter(d => d.Annee == year)
                      .reduce((sum, current) => sum + current.Quantite, 0).toFixed(2);
  }

}