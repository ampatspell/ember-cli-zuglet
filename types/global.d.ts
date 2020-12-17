// Types for compiled templates
declare module 'zuglet/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

type Fixme = any; // eslint-disable-line @typescript-eslint/no-explicit-any
type FixemFn = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
