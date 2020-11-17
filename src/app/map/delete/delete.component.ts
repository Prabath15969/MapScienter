import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MapService } from "src/app/service/map.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.scss"],
})
export class DeleteComponent implements OnInit {
  code;
  constructor(
    private service: MapService,
    private dialogref: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.code = data.data;
  }

  ngOnInit() {}

  onNoClick() {
    this.dialogref.close();
  }
  delete() {
    this.service.deletePoly(this.code);
  }
}
