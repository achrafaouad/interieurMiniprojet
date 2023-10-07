import { Circle, Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { LineStyle } from "./LineStyle";
import Text from 'ol/style/Text';
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

const  lines = new LineStyle(
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


export  const pointStyle = (feature,resolution) => { 

  //condition get etat projet color
  let colorp ="red"; 


  return new Style({


    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: colorp }),
      stroke: new Stroke({ color: 'white', width: 2 }),
    }),

    
    text:new Text({
      scale:[1.3,1.3],
      textAlign:  'center',
    // textBaseline: <string> lines.baseline,
    font: <string>lines.font,
    text:  feature.get("id_2"),
    fill: new Fill({ color: "white" }),
    stroke: new Stroke({ color: "black", width: 2 }),
    offsetX: 0,
    offsetY: -15,
    placement: "point",
    maxAngle: 45,
    overflow: lines.overflow,
    rotation: <any>lines.rotation,
    
    
    })
  });}
  
  export  const  lineStringStyle = (feature,resolution)=>  new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
    text:new Text({
      scale:[1.3,1.3],
      textAlign:  'center',
    // textBaseline: <string>lines.baseline,
    font: <string>lines.font,
    text: (0.002362464157453313<resolution)?'': feature.get("intitule"),
    fill: new Fill({ color: "blue" }),
    stroke: new Stroke({ color: "white", width: 3 }),
    offsetX: 0,
    offsetY: -15,
    placement: "point",
    maxAngle: 45,
    overflow: lines.overflow,
    rotation: <any>lines.rotation,
    
    
    })
  });
  
  export  const  polygonStyle = (feature,resolution)=> new Style({
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
    font: <string>lines.font,
    text: (0.002362464157453313<resolution)?'': feature.get("intitule"),
    fill: new Fill({ color: "blue" }),
    stroke: new Stroke({ color: "white", width: 3 }),
    offsetX: 0,
    offsetY: -15,
    placement: "point",
    maxAngle: 45,
    overflow: lines.overflow,
    rotation: <any>lines.rotation,
    
    
    })
  });
  
  export  const  defaultStyle = new Style({
    fill: new Fill({ color: 'gray' }),
    stroke: new Stroke({ color: 'black', width: 1 }),
  });




  export const style1 = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 1
    }),
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 1
      })
    })
  });
  export const style2 = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 1
    }),
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 1
      })
    })
  });



  export const basemapimageo2 = new TileLayer({
    visible: true,
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
  });
  export const basemapimageo1 = new TileLayer({
    visible: true,
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ,          crossOrigin: 'anonymous' // Set the cross-origin attribute

    })
  });

  export const titles2o2 = new TileLayer({
    visible: true,
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    })
  });
  export const titles2o1 = new TileLayer({
    visible: true,
    source: new XYZ({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
    })
  });




  export const regionSource = new VectorSource({
    format: new GeoJSON(),

    url: (extent) => {
      return ("http://localhost:8080/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=i2singineerie:region&outputFormat=application/json&" +
        'bbox=' + extent.join(',') + ',EPSG:4326');
    },
    strategy: bboxStrategy,

  });


  // Add the buffered layer to the map
  export const provinceSource = new VectorSource({
    format: new GeoJSON(),

    url: (extent) => {
      return ("http://localhost:8080/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=i2singineerie:province&outputFormat=application/json&" +
        'bbox=' + extent.join(',') + ',EPSG:4326');
    },
    strategy: bboxStrategy,

  });

  export const communeSource = new VectorSource({
    format: new GeoJSON(),

    url: (extent) => {
      return ("http://localhost:8080/geoserver/i2singineerie/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=i2singineerie:communes&outputFormat=application/json&" +
        'bbox=' + extent.join(',') + ',EPSG:4326');
    },
    strategy: bboxStrategy,

  });
