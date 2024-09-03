declare module "express/lib/router" {
  export function param(name: string, handler: any): any;
}
