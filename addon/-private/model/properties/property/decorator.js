import { getOwner } from '../../../util/get-owner';
import { getState } from '../../state';

const {
  assign
} = Object;

export const createProperty = (owner, key, name, opts) => {
  return getState(owner).getProperty(key, state => {
    return getOwner(owner).factoryFor(`zuglet:properties/${name}`).create(assign({ state }, opts));
  });
}

// export const property = ({ readOnly, deps, property, opts }) => {

//   let getProperty = (owner, key) => {
//     return createProperty(owner, key, property, { owner, key, deps, opts });
//   }

//   let get = function (key) {
//     return getProperty(this, key).getPropertyValue();
//   }

//   let set;
//   if(!readOnly) {
//     set = function (key, value) {
//       return getProperty(this, key).setPropertyValue(value);
//     }
//   }

//   let decorator = computed(...deps, {
//     get,
//     set
//   });

//   if(readOnly) {
//     decorator = decorator.readOnly();
//   }

//   return decorator;
// }
