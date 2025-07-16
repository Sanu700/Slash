import React, { useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = "AIzaSyDuFZbhqg3iFNVljlXFo3tQcHjJqWSX9Qs";

// Add TypeScript declarations for custom elements
// @ts-ignore
interface GMPMapElement extends HTMLElement {
  innerMap: any;
  center: any;
  zoom: any;
}
// @ts-ignore
interface GMPAdvancedMarkerElement extends HTMLElement {
  position: any;
}
// @ts-ignore
interface GMPXPlacePickerElement extends HTMLElement {
  value: any;
}

const ExperienceMap = () => {
  useEffect(() => {
    const init = async () => {
      await window.customElements.whenDefined('gmp-map');
      const map = document.querySelector('gmp-map') as GMPMapElement | null;
      const marker = document.querySelector('gmp-advanced-marker') as GMPAdvancedMarkerElement | null;
      const placePicker = document.querySelector('gmpx-place-picker') as GMPXPlacePickerElement | null;
      // @ts-ignore
      const infowindow = new window.google.maps.InfoWindow();

      if (!map || !marker || !placePicker) return;
      // @ts-ignore
      map.innerMap.setOptions({ mapTypeControl: false });

      placePicker.addEventListener('gmpx-placechange', () => {
        const place = placePicker.value;
        if (!place.location) {
          window.alert("No details available for input: '" + place.name + "'");
          infowindow.close();
          marker.position = null;
          return;
        }
        if (place.viewport) {
          // @ts-ignore
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }
        marker.position = place.location;
        infowindow.setContent(
          `<strong>${place.displayName}</strong><br>
           <span>${place.formattedAddress}</span>`
        );
        // @ts-ignore
        infowindow.open(map.innerMap, marker);
      });
    };
    document.addEventListener('DOMContentLoaded', init);
    return () => {
      document.removeEventListener('DOMContentLoaded', init);
    };
  }, []);

  // @ts-ignore: Suppress all JSX errors for custom elements in this block
  return (
    // @ts-ignore
    <div style={{ width: '100%', height: '500px' }}>
      <gmpx-api-loader
        key={GOOGLE_MAPS_API_KEY}
        solution-channel="GMP_GE_mapsandplacesautocomplete_v2"
      ></gmpx-api-loader>
      <gmp-map
        center="40.749933,-73.98633"
        zoom="13"
        map-id="DEMO_MAP_ID"
        style={{ width: '100%', height: '100%' }}
      >
        <div slot="control-block-start-inline-start" className="place-picker-container" style={{ padding: 20 }}>
          <gmpx-place-picker placeholder="Enter an address"></gmpx-place-picker>
        </div>
        <gmp-advanced-marker></gmp-advanced-marker>
      </gmp-map>
    </div>
  );
};

export default ExperienceMap; 