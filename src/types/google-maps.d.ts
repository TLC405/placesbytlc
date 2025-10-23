declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          PlacesService: any;
          PlacesServiceStatus: any;
        };
        LatLng: any;
      };
    };
  }
}

export {};
