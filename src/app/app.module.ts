import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MapComponent } from "./map/map.component";
import { AgmCoreModule } from "@agm/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorPickerModule } from "ngx-color-picker";

import {
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
} from "@angular/material";
import { ContentsComponent } from "./map/contents/contents.component";
import { DeleteComponent } from "./map/delete/delete.component";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ContentsComponent,
    DeleteComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBVst5D1IiluQ1IlYfbo2xbAI4ogKRPx6A",
      libraries: ["places", "drawing", "geometry"],
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ColorPickerModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ContentsComponent, DeleteComponent],
})
export class AppModule {}
