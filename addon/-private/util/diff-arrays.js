import { A } from '@ember/array';

export const diffArrays = (current, next) => {
  current = A(current);
  next = A(next);

  let added = A();
  let removed = A([ ...current ]);
  let intact = A();

  next.forEach(model => {
    if(current.includes(model)) {
      intact.pushObject(model);
    } else {
      added.pushObject(model);
    }
    removed.removeObject(model);
  });

  return {
    added,
    removed,
    intact
  };
}
