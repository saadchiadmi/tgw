import { Injectable } from '@angular/core';
import * as  XLSX from 'xlsx'
import { Data } from '../entities/data';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelDataService {

  constructor() { }

  getData() : Observable<Data[]>{
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
      result = XLSX.utils.sheet_to_json(workSheet,{raw : true})
    }
    rec.send();
    
    return of(result);
  }
}
