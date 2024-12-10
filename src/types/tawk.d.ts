export interface TawkAPI {
  maximize: () => void;
  minimize: () => void;
  toggle: () => void;
  popup: () => void;
  showWidget: () => void;
  hideWidget: () => void;
  setAttributes: (attributes: object, callback?: (error: any) => void) => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkAPI;
    Tawk_LoadStart?: Date;
  }
}

export {};
