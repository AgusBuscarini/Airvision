import * as L from "leaflet";

declare module "leaflet" {
  interface MarkerClusterGroup extends L.FeatureGroup {
    addLayers(layers: L.Layer[], skipLayerAddEvent?: boolean): this;
  }

  function markerClusterGroup(options?: any): MarkerClusterGroup;
}