import { Component, OnInit } from '@angular/core';

import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import GeoJSON from 'ol/format/GeoJSON';

import WFS from 'ol/format/WFS';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css']
})
export class RestComponent implements OnInit {

  private feature: Feature = new Feature({
    geometry: new Polygon([
      [
        [
          -6127192.187339729,
          -1117815.1016424175
        ],
        [
          -5911945.515688673,
          -922136.3092323663
        ],
        [
          -5657563.0855556065,
          -1181410.7091756843
        ],
        [
          -5951081.274170683,
          -1284142.0751909611
        ],
        [
          -6127192.187339729,
          -1117815.1016424175
        ]
      ]]),
    //valores definidos a seguir serão incluidos em properties
    param1: 'goiaba',
    param2: 'abacate'
  });

  private geoJson: GeoJSON = new GeoJSON();
  private featureString;

  private featureService: WFS = new WFS();
  private xml: string;
  private xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();

  constructor() { }

  ngOnInit() {
    this.featureString = this.geoJson.writeFeatureObject(this.feature);
    console.log(this.save(this.feature));
    this.xml = new XMLSerializer().serializeToString(this.save(this.feature));
    console.log(this.xml);
    this.xmlHttpRequest.open('POST', '', true);
    this.xmlHttpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
    this.xmlHttpRequest.setRequestHeader('Content-Type', 'text/xml')
    this.xmlHttpRequest.send(this.xml);

  }

  log(){
    console.log(this.featureString);
  }
  
  save(feature: Feature){
    return this.featureService.writeTransaction([feature], null, null, {
      featureNS: 'http//localhost:8080/geoserver/siga', //workspace URI 
      featureType: 'polygon1', // Nome da Layer
      srsName: 'EPSG:4326', //Sistema de Referencia Espacial
      version: '1.1.0' //Versão utilizada WFS(1.0.0 ou 1.1.0)
    });
  }
}
