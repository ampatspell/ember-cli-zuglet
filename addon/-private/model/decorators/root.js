import { setRoot } from '../state';

export const root = () => Class => setRoot(Class);
