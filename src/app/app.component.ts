import { Component, HostListener, OnInit } from '@angular/core';
import { Overlay, View } from 'ol';
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { Router } from '@angular/router';
import Text from 'ol/style/Text';
import Swal from 'sweetalert2'
import Map from "ol/Map";
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { Feature } from 'ol';
import FullScreen from 'ol/control/FullScreen';
import Zoom from 'ol/control/Zoom';
import ScaleLine from 'ol/control/ScaleLine';
import VectorSource from 'ol/source/Vector';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import WFS from 'ol/format/WFS';
import VectorLayer from 'ol/layer/Vector';
import { pointStyle, lineStringStyle, polygonStyle, defaultStyle, style1, style2, basemapimageo1, basemapimageo2, titles2o2, titles2o1, provinceSource, communeSource, regionSource } from "./Helper";
import { communes, douar, projectes, province } from './jsonFiles/shapes';
import { LineStyle } from './LineStyle';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  searchedProject=""
  view = new View({
    center: [
      0, 0
    ],
    zoom: 8,
    projection: "EPSG:4326",
  });

  lines = new LineStyle(
    "Normal",
    "center",
    "middle",
    "0",
    "Arial",
    "Bold",
    "Point",
    "0.7853981633974483",
    true,
    "12px",
    "10",
    "3px",
    "4px",
    "black",
    "white",
    "4",
    "38400"
  );

  douarsource = new VectorSource({  features : new GeoJSON().readFeatures(douar), });
  provincesource = new VectorSource({  features : new GeoJSON().readFeatures(province), });
  communesource = new VectorSource({  features : new GeoJSON().readFeatures(communes), });
  projectsource = new VectorSource({  features : new GeoJSON().readFeatures(projectes), });

  vectorDouar = new VectorLayer({
    source: this.douarsource,
    style:(feature,resolution)=>  new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.1)',
      }),
      text:new Text({
        scale:[1.3,1.3],
        textAlign:  'center',
      // textBaseline: <string>lines.baseline,
      font: <string>this.lines.font,
      text: (0.002362464157453313<resolution)?'': feature.get("intitule"),
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white", width: 3 }),
      offsetX: 0,
      offsetY: -15,
      placement: "point",
      maxAngle: 45,
      overflow: this.lines.overflow,
      rotation: <any>this.lines.rotation,
      
      
      })
    })
  });
  vectorprovince = new VectorLayer({
    source: this.provincesource,
    style: (feature,resolution)=>  new Style({
      stroke: new Stroke({
        color: 'black',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.1)',
      }),
      text:new Text({
        scale:[1.3,1.3],
        textAlign:  'center',
      // textBaseline: <string>lines.baseline,
      font: <string>this.lines.font,
      text: (0.002362464157453313<resolution)?'': feature.get("intitule"),
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white", width: 3 }),
      offsetX: 0,
      offsetY: -15,
      placement: "point",
      maxAngle: 45,
      overflow: this.lines.overflow,
      rotation: <any>this.lines.rotation,
      
      
      })
    })
  });
  vectorCommune = new VectorLayer({
    source: this.communesource,
    style:  (feature,resolution)=>  new Style({
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(245, 245, 245, 0.1)',
      }),
      text:new Text({
        scale:[1.3,1.3],
        textAlign:  'center',
      // textBaseline: <string>lines.baseline,
      font: <string>this.lines.font,
      text: (0.002362464157453313<resolution)?'': feature.get("nom_com"),
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white", width: 3 }),
      offsetX: 0,
      offsetY: -15,
      placement: "point",
      maxAngle: 45,
      overflow: this.lines.overflow,
      rotation: <any>this.lines.rotation,
      
      
      })
    })
  });

  vectorProject = new VectorLayer({
    source: this.projectsource,
    style: (feature, resolution) => {
      const geometryType = feature.getGeometry().getType();

      if (geometryType === 'Point') {
        return pointStyle(feature, resolution);
      } else if (geometryType === 'LineString') {
        return lineStringStyle(feature, resolution);
      } else if (geometryType === 'Polygon') {
        return polygonStyle(feature, resolution);
      }

      return defaultStyle;
    },
  });

  container: any;
  selectedrisque: any;
  content: any;
  closer: any;
  overlay: any;

  ngOnInit(): void {
    
    this.map = new Map({
      layers: [
        basemapimageo1,
        new TileLayer({

          source: new XYZ({
            url: 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
           , crossOrigin: 'anonymous' // Set the cross-origin attribute
          })
        })
        
        , 
        this.vectorprovince,
        
        this.vectorCommune,

        this.vectorDouar
        , 
        this.vectorProject
        
        

      ],
      target: "mapPrev",
      view: this.view,
      controls: [new Zoom(), new FullScreen(), new ScaleLine(), new ZoomSlider()]
    });

    this.flyTo([-8.001494669816758, 31.159887934474902], () => { });


    this.container = <HTMLElement>document.getElementById("popup");
    this.content = <HTMLElement>document.getElementById("popup-content");
    this.closer = <HTMLElement>document.getElementById("popup-closer");
    this.overlay = new Overlay({
      element: this.container,
      autoPan: true,
      // autoPanAnimation: {
      //   duration: 250,
      // },
    });

    this.closer.onclick = () => {
      this.overlay.setPosition(undefined);
      if (this.closer) this.closer.blur();
      return false;
    };
    this.map.addOverlay(this.overlay);




    this.map.on('click', (evt: any) => {
      console.error(evt.coordinate)

      this.map.forEachFeatureAtPixel(evt.pixel, (feature: any, Layer: any) => {

        var object = feature.getProperties();

        var vv
        if (Layer === this.vectorDouar) {
          vv = `<table id="customers" class="table-style">
        <thead>
          <tr>
            <th colspan="2"><b>Douar</b></th>
          </tr>
        </thead>
        <tr>
          <td class="boldy" colspan="2" style="cursor:pointer" >
          <span class="clickable-td" >${object.nom_douar}</span>
          </td>
        </tr>
        <tr>
          <td><b>IdS_Nom </b></td>
          <td font-style="italic">${object.IdS_Nom}</td>
        </tr>
        <tr>
          <td><b>id_S </b></td>
          <td font-style="italic">${object.id_S}</td>
        </tr>
        <tr>
          <td><b>id </b></td>
          <td font-style="italic">${object.id}</td>
        </tr>
        <tr>
          <td><b>layer </b></td>
          <td>${object.layer}</td>
        </tr>
      
      </table>
      `



          this.content.innerHTML = vv

          this.overlay.setPosition(evt.coordinate)


        }
      }
        
        
        )}

    )}
  title = 'project';
  format: any;
  map!: Map;

flyTo(location: any, done: any) {
    const duration = 5000;
    const zoom = this.view.getZoom();
    let parts = 2;
    let called = false;
    function callback(complete: any) {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0 || !complete) {
        called = true;
        done(complete);
      }
    }
    this.view.animate(
      {
        center: location,
        duration: duration,
      },
      callback
    );
    this.view.animate(
      {
        zoom: zoom! - 1,
        duration: duration / 2,
      },
      {
        zoom: zoom,
        duration: duration / 2,
      },
      callback
    );
  }


  getProjectsDouarByIds(){
    let douarsource;
    console.log(this.searchedProject);

    
    
    const filteredFeatures = this.filterFeaturesById(douar.features, this.searchedProject); // Replace targetId with the desired id
    
    console.log(filteredFeatures)
    
    if(filteredFeatures.length>0){
      this.douarsource.clear();
      douarsource = new VectorSource({
        features: new GeoJSON().readFeatures({
          type: 'FeatureCollection',
          features: filteredFeatures
        })
      });
  
      this.vectorDouar.setSource(douarsource);
      const extent = douarsource.getExtent();
  
  
      // Set the view of the map to the calculated extent
      this.map.getView().fit(extent, { duration: 2000, size: this.map.getSize(), padding: [90,90, 90, 90] });
    }else{

      Swal.fire({
        title: 'Error!',
        text: 'Pas de douar affecté a ce projet !',
        icon: 'error',
        confirmButtonText: 'fermer'
      })

      
      douarsource = new VectorSource({  features : new GeoJSON().readFeatures(douar), });
      this.vectorDouar.setSource(douarsource);

    }
   

  }


  filterFeaturesById(features, targetId) {
    return features.filter(feature =>  feature.properties.id_S.toLowerCase() === targetId.toLowerCase());

    // return features.filter(feature => feature.get('id_S')  === targetId);
  }

  
}
