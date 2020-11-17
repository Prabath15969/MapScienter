import { Injectable } from "@angular/core";
import { MapData } from "../model/map.model";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MapService {
  pointsArray = [];
  mymap = new Map();

  constructor() {}

  saveData(data: MapData) {
    this.pointsArray.push(data);
    let KML = data.code;
    this.mymap.set(KML, data);
    console.log("map", this.mymap);
    console.log("array", this.pointsArray);
  }
  deletePoly(code) {
    this.mymap.delete(code);
    console.log(this.mymap);

    for (var i = 0; i < this.pointsArray.length; i++) {
      if (this.pointsArray[i].code == code) {
        this.pointsArray.splice(i, 1);
      }
      console.log(this.pointsArray[i]);
    } //=> [1, 2, 3, 4, 6, 7, 8, 9, 0]
  }
  getdata(code): Observable<any> {
    return this.mymap.get(code).asObservable();
  }
}
