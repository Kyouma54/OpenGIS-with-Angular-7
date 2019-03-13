import { Component, OnInit } from '@angular/core';

import {Map, View} from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import Geolocation from 'ol/Geolocation.js';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { OSM, Stamen, Vector as VectorSource} from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import {ScaleLine, FullScreen} from 'ol/control.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import WFS from 'ol/format/WFS';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  private map: Map;
  private view: View;

  private layerEstradas: TileLayer;
  private layerTerrenos: TileLayer;
  private layerMunicipio: TileLayer;
  private layerUC: TileLayer;
  private layerTI: TileLayer;
  private layerTQ: TileLayer;
  private layerElemento: VectorLayer;
  private layersElemento: VectorLayer[];

  private geolocation: Geolocation;

  private scaleLineControl: ScaleLine = new ScaleLine();
  private fullscrenControl: FullScreen = new FullScreen();

  private drawVectorSource: VectorSource = new VectorSource();
  private drawVectorLayer: VectorLayer;

  private draw: Draw;
  private snap: Snap;
  private modify: Modify;
  private drawIsActive: boolean = false;

  private geojsonObject = {
    'type': 'FeatureCollection',
    'features': [
      {'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
      }},
    ]
  };

  ngOnInit(): void {
    this.layerEstradas = new TileLayer({
      type: 'base',
      source: new OSM({
        url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
      }),
      wrapX: false
    });

    this.layerTerrenos = new TileLayer({
      type: 'base',
      source: new Stamen({
        layer: 'terrain'
      }),
      visible: false
    })

    this.layerMunicipio = new TileLayer({
      type: 'overlay',
      source: new TileWMS({
        url: 'http://siscom.ibama.gov.br/geoserver/ows',
        params: {'LAYERS': 'SINAFLOR:geo_area_empreendimento', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
      }),
      visible: false
    });

    this.layerUC = new TileLayer({
      type: 'overlay',
      source: new TileWMS({
        url: 'http://siscom.ibama.gov.br/geoserver/ows',
        params: {'LAYERS': 'SINAFLOR:geo_area_empreendimento', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
      }),
      visible: false
    });
    
    this.layerTI = new TileLayer({
      type: 'overlay',
      source: new TileWMS({
        url: 'http://cmr.funai.gov.br/geoserver/ows',
        params: {'LAYERS': 'CMR-PUBLICO:lim_terra_indigena_a', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
      }),
      visible: false
    });

    this.layerTQ = new TileLayer({
      type: 'overlay',
      source: new TileWMS({
        url: 'http://siscom.ibama.gov.br/geoserver/ows',
        params: {'LAYERS': 'SINAFLOR:geo_area_empreendimento', 'TILED': true},
        serverType: 'geoserver',
        transition: 0
      }),
      visible: false
    });

    this.layerElemento = new VectorLayer({
      type: 'vectorOverlay',
      source: new VectorSource({
        features: (new GeoJSON()).readFeatures(this.geojsonObject)
      }),
      visible: false
    });

    this.geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true
      }
    });

    this.drawVectorLayer = new VectorLayer({
      source: this.drawVectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(180,180,180,0.6)'
        }),
        stroke: new Stroke({
          color:'rgba(0,0,0,0.6)',
          width: 2
        })
      })
    });

    this.modify = new Modify({
      source: this.drawVectorSource
    });

    this.draw = new Draw({
      source: this.drawVectorSource,
      type: 'Polygon'
    });

    this.snap = new Snap({
      source: this.drawVectorSource
    });

    this.map = new Map({
      target: 'map',
      layers: [this.layerEstradas, this.layerTerrenos, this.layerMunicipio, 
       this.layerUC, this.layerTI, this.layerTQ, this.layerElemento, this.drawVectorLayer],
      view: new View({
        center: fromLonLat([-53.305664,-10.314919]),
        zoom: 5,
        minZoom: 5,
        maxZoom: 17,
        extent: transform(
          [-74.225693,-34.0,-3191634.83, 635589.22], 
          'EPSG:4326', 'EPSG:3857'
        )
      }),
      controls: [this.scaleLineControl, this.fullscrenControl]
    });
  }

  log(){
    if(!this.map.getLayers().getArray()[4].getVisible()){
      this.layerTI.setVisible(true);
    }else{
      this.map.getLayers().getArray()[4].setVisible(false);
    }
  }

  getDraw(){
    if(this.drawIsActive == false){
      this.draw.on('drawstart', currentDraw => {
        currentDraw.feature.setProperties({
          'id': ''
        })
      });
      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.draw);
      this.map.addInteraction(this.snap);
      this.drawIsActive = true;
      console.log(this.drawVectorSource.getFeatures());
    }
    else{
      this.map.removeInteraction(this.modify);
      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.snap);
      this.drawIsActive = false;
      
    }
  }

  logs(){
    console.log(new GeoJSON().writeFeaturesObject(this.drawVectorSource.getFeatures()));
  }

  getLocation(){
    this.geolocation.setTracking(true);
    this.getPosition();
  }

  waitTracking(){
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.geolocation.getPosition())
      }, 1000)
    })
  }

  getPosition(){
    this.waitTracking().then(position => {
      if(position == undefined){
        this.getPosition();
      }else{
        this.map.getView().animate({
          center: fromLonLat([position[0], position[1]]), 
          zoom: 10
        });
      }
    })
  }

  // wfs request filter
 // http://geoserver.funai.gov.br/geoserver/ows?service=wfs&version=2.0.0&request=GetFeature&typeName=Funai:tis_estudo&outputFormat=application/json
 // http://demo.opengeo.org/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&typename=topp:states&PROPERTYNAME=STATE_NAME&CQL_FILTER=STATE_NAME='Illinois
 // http://demo.opengeo.org/geoserver/wfs?service=wfs&version=1.0.0&request=getfeature&typename=topp:states&PROPERTYNAME=STATE_NAME&CQL_FILTER=STATE_NAME LIKE 'I%25'
 // &CQL_FILTER=field=value AND field=value AND field=value
}
