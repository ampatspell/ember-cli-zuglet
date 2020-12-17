export default config;

/**
 * Type declarations for
 *    import config from 'my-app/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: string;
  rootURL: string;
  APP: Record<string, unknown>;
  dummy: {
    name: string,
    version: string,
    // TODO: use zuglet's type when it's available
    firebase: { [key: string]: string }
  }
};
