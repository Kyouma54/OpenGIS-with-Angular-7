import { Component, OnInit } from '@angular/core';

import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON';

import WFS from 'ol/format/WFS';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css']
})
export class RestComponent implements OnInit {

  private feature: Feature = new Feature({
    geometry: new Polygon([[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]),
    //valores definidos a seguir serão incluidos em properties
    name: 'poly',
    abacate: 'arroz'
  });

  private geoJson: GeoJSON = new GeoJSON();
  private featureString;

  constructor() { }

  ngOnInit() {
    console.log(this.feature);
    console.log(this.feature.getKeys());
    console.log(this.feature.getProperties());
    console.log(this.feature.getGeometry());
    this.featureString = this.geoJson.writeFeatureObject(this.feature);
    
  }

  log(){
    console.log(this.featureString);
  }
  
}
