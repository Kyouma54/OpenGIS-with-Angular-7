import { Injectable, WtfScopeFn } from '@angular/core';

import Feature from 'ol/Feature';
import WFS from 'ol/format/WFS';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }
 
  private geoserverResourceUrl: string = 'http://localhost:8080/geoserver/siga/ows';
  private geoserverWFS: string = 'http://geoserver.funai.gov.br/geoserver/wfs';
  private geoserverWMS: string = 'http://geoserver.funai.gov.br/geoserver/wfs';
  
  private transaction: Node;
  private bodyRequest: string;

  //No Providers
  private wfs: WFS = new WFS();
  private xmlSerializer: XMLSerializer = new XMLSerializer();
  private xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();
  //

  create(feature: Feature){
    this.transaction = this.wfs.writeTransaction([feature], null, null, {
      featureNS: 'http//localhost:8080/geoserver/siga', //workspace URI 
      featureType: 'polygon1', // Nome da Layer
      srsName: 'EPSG:4326', //Sistema de Referencia Espacial
      version: '1.1.0' //Versão utilizada WFS(1.0.0 ou 1.1.0)
    });

    this.bodyRequest = this.xmlSerializer.serializeToString(this.transaction);
    this.xmlHttpRequest.open('POST', this.geoserverResourceUrl, true);
    this.xmlHttpRequest.setRequestHeader('Content-Type', 'text/xml');
    this.xmlHttpRequest.setRequestHeader('Access-Control-Allow-Origin', 'http//localhost:4200');
    this.xmlHttpRequest.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    this.xmlHttpRequest.setRequestHeader('Access-Control-Allow-Headers', 'origin,x-requested-with,access-control-request-headers,content-type,access-control-request-method,accept');
    this.xmlHttpRequest.send(this.bodyRequest);
  }

  update(){

  }

  delete(){

  }

}
