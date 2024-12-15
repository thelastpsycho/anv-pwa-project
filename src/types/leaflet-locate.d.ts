import * as L from "leaflet";

declare module "leaflet" {
  namespace Control {
    interface LocateOptions {
      position?: string;
      strings?: {
        title?: string;
      };
      flyTo?: boolean;
      cacheLocation?: boolean;
      showCompass?: boolean;
      locateOptions?: L.LocateOptions;
    }

    class Locate extends L.Control {
      constructor(options?: LocateOptions);
      start(): void;
      stop(): void;
      setView(): void;
    }
  }

  namespace control {
    function locate(options?: Control.LocateOptions): Control.Locate;
  }
}
