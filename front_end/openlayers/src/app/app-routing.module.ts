import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MapComponent } from './map/map.component';
import { RestComponent } from './rest/rest.component';

const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'rest', component: RestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
