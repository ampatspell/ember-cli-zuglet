import { setRoot } from './state';

export const autoactivate = () => Class => setRoot(Class);
