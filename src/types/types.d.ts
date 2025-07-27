declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

interface LudusaviConfig {
  cloud: {
    remote: unknown | null;
    path: string;
    synchronize: boolean;
  }
}