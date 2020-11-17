import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MapComponent } from "./map/map.component";
import { DeleteComponent } from "./map/delete/delete.component";

const routes: Routes = [
  { path: "", component: MapComponent },
  { path: "new", component: DeleteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
