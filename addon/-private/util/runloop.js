import { next as _next } from '@ember/runloop';

export const next = () => new Promise(resolve => _next(resolve));
