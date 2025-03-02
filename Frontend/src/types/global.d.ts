interface Window {
  L: any;
  [key: string]: any;
}

declare global {
  interface Window {
    L: any;
    [key: string]: any;
  }
  const global: Window;
}

export {};
