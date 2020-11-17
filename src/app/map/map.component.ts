import { Component, OnInit } from "@angular/core";
import { AgmInfoWindow } from "@agm/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { ContentsComponent } from "./contents/contents.component";
import { MapService } from "../service/map.service";
import { MapData } from "../model/map.model";
import { async } from "@angular/core/testing";
import { DeleteComponent } from "./delete/delete.component";
declare const google: any;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  pointList: { lat: number; lng: number }[] = [];
  selectedArea = 0;
  latitude: number;
  longitude: number;
  zoom: number;
  drawingManager: any;
  selectedShape: any;
  listOfPolygons = [];
  mapeka: any;
  isView = true;

  displayedColumns: string[] = ["City", "Code", "View", "Delete"];

  constructor(private dialog: MatDialog, private service: MapService) {}

  ngOnInit() {
    this.setCurrentLocation();
    this.listOfPolygons = this.service.pointsArray;
  }
  loadsinglePolygons(code) {
    let polygon1;
    // this.polygon1.pointList = [];
    polygon1 = this.service.mymap.get(code);
    let map = this.mapeka;
    // let map: google.maps.Map;
    console.log(polygon1);
    let infoWindow: google.maps.InfoWindow;
    let bermudaTriangle = new google.maps.Polygon({
      paths: polygon1.pointList,
      strokeColor: "#FF0000",
      strokeWeight: 2,
      fillColor: polygon1.color,
      fillOpacity: 0.35,
      editable: true,
    });

    bermudaTriangle.setMap(this.mapeka);
    bermudaTriangle.addListener("click", showArrays);
    bermudaTriangle.addListener("rightclick", deletePoly);
    document.getElementById("delete").addEventListener("click", remove);

    infoWindow = new google.maps.InfoWindow();
    function showArrays(event: any) {
      infoWindow.close();

      let contentString =
        "<b>" +
        "City :" +
        polygon1.city +
        "<b>" +
        "<br>" +
        "City Code :" +
        code +
        "<br>";

      // Replace the info window's content and position.
      infoWindow.setContent(contentString);
      infoWindow.setPosition(event.latLng);

      infoWindow.open(map);
    }
    function deletePoly(event: any) {
      infoWindow.close();
      const contentString = document.getElementById("delete-window");
      // let contentString = "<button onclick=remove>Remove</button>";
      // Replace the info window's content and position.
      infoWindow.setContent(contentString);
      infoWindow.setPosition(event.latLng);

      infoWindow.open(map);
    }
    function remove() {
      bermudaTriangle.setMap(null);
      console.log("remove");
      infoWindow.close();
    }
  }

  deletePolygon(code) {
    // this.service.deletePoly(code);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: code,
    };
    this.dialog.open(DeleteComponent, dialogConfig);
  }

  loadPolygons() {
    console.log("load", this.listOfPolygons);
    let map = this.mapeka;
    let infoWindow: google.maps.InfoWindow;
    this.listOfPolygons.forEach(function (val) {
      console.log("load2");

      let bermudaTriangle = new google.maps.Polygon({
        paths: val.pointList,
        strokeColor: "#AF1021",
        strokeWeight: 2,
        fillColor: val.color,
        fillOpacity: 0.35,
      });
      addpoly();

      // bermudaTriangle.setMap(map);

      bermudaTriangle.addListener("click", showArrays);
      bermudaTriangle.addListener("rightclick", remove);

      infoWindow = new google.maps.InfoWindow();

      async function addpoly() {
        await setTimeout(() => {
          bermudaTriangle.setMap(map);
          console.log("Function:executed");
        }, 1000);
      }

      async function remove() {
        bermudaTriangle.setMap(null);
        console.log("remove");
      }

      function showArrays(event: any) {
        infoWindow.close();

        let contentString =
          "<b>" +
          "City :" +
          val.city +
          "<b>" +
          "<br>" +
          "City Code :" +
          val.code +
          "<br>";

        // Replace the info window's content and position.
        infoWindow.setContent(contentString);
        infoWindow.setPosition(event.latLng);

        infoWindow.open(map);
      }
    });
  }

  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 10;
      });
    }
  }

  OpenContents(data) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "30%";
    // dialogConfig.height = "20%";
    dialogConfig.data = {
      data: data,
    };
    dialogConfig.position = {
      top: "10px",
      left: "10px",
    };
    this.dialog.open(ContentsComponent, dialogConfig);
  }

  onMapReady(map) {
    this.initDrawingManager(map);
    this.mapeka = map;
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      "overlaycomplete",
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          console.log("complete");
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            console.log(paths);
            google.maps.event.addListener(paths.getAt(p), "set_at", () => {
              if (!event.overlay.drag) {
                self.updatePointList(event.overlay.getPath());
                console.log(event.overlay.getPath());
              }
            });
            google.maps.event.addListener(paths.getAt(p), "insert_at", () => {
              self.updatePointList(event.overlay.getPath());
            });
            google.maps.event.addListener(paths.getAt(p), "remove_at", () => {
              self.updatePointList(event.overlay.getPath());
            });
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  };

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(path.getAt(i).toJSON());
      console.log(typeof path.getAt(i));
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(path);
  }
  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  SaveShape(data) {
    console.log("Save");
    console.log(data);
    this.OpenContents(this.pointList);
    this.deleteSelectedShape();
  }
}
