import { Component, OnInit, Inject, ViewContainerRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapService } from "src/app/service/map.service";
import { MapData } from "src/app/model/map.model";
import { Cmyk, ColorPickerService } from "ngx-color-picker";

@Component({
  selector: "app-contents",
  templateUrl: "./contents.component.html",
  styleUrls: ["./contents.component.scss"],
})
export class ContentsComponent implements OnInit {
  data: any;
  polygon: FormGroup;

  constructor(
    public vcRef: ViewContainerRef,
    private cpService: ColorPickerService,
    private service: MapService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContentsComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data.data;
    console.log(data);
  }

  ngOnInit() {
    this.polygon = this.fb.group({
      code: ["", [Validators.required]],
      city: ["", [Validators.required]],
      color: ["", []],
    });
  }

  get code() {
    return this.polygon.get("code");
  }
  get city() {
    return this.polygon.get("city");
  }
  get color() {
    return this.polygon.get("color");
  }

  savePolygon() {
    const polygonData = {
      pointList: this.data,
      city: this.city.value,
      code: this.code.value,
      color: this.color.value,
    } as MapData;
    this.service.saveData(polygonData);
    this.close();
  }
  close() {
    this.dialogRef.close();
  }

  public onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);

    const rgba = this.cpService.hsvaToRgba(hsva);

    console.log(color);

    return this.cpService.rgbaToCmyk(rgba);
  }
}
