// Types for compiled templates
declare module 'ember-cli-zuglet/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

type Fixme = any;
type FixemFn = (...args: any[]) => any;
