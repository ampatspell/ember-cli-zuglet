import Mixin from '@ember/object/mixin';

const namesFromInfos = infos => infos.map(i => i.name);
const __zuglet = '__zuglet';

const mapInfos = infos => infos.map(info => {
  let {
    name,
    handler: {
      currentModel: model
    }
  } = info;
  return { name, model };
});

const storeInfos = (router, oldInfos, newInfos) => {
  oldInfos = mapInfos(oldInfos);
  newInfos = mapInfos(newInfos);
  router[__zuglet] = { oldInfos, newInfos };
};

const retreiveInfos = (router) => {
  let { oldInfos, newInfos } = router[__zuglet];
  router[__zuglet] = null;
  return { oldInfos, newInfos };
}

// const replaced = (source, target) => {
//   let arr = [];
//   for(let i = 0; i < source.length; i++) {
//     let s = source[i];
//     let t = target[i];
//     if(!t || s.name !== t.name || s.model !== t.model) {
//       arr.push(s);
//     }
//   }
//   return arr;
// }

const replaced = (oldInfos, newInfos, finalInfos) => {
  let len = Math.max(oldInfos.length, newInfos.length, finalInfos.length);
  for(let i = 0; i < len; i++) {
    let o = oldInfos[i];
    let n = newInfos[i];
    let f = finalInfos[i];
    if(o && n && f) {
      if(o.name === n.name && o.name === f.name) {
        if(o.model === n.model && o.model === f.model) {
          console.log('match', o.name);
        }
      }
    }
  }
}

const destroyModels = (oldInfos, newInfos, finalInfos) => {
  console.log('-------------------------------------------------');
  console.log('old: ', oldInfos);
  console.log('new: ', newInfos);
  console.log('fnl: ', finalInfos);
  replaced(oldInfos, newInfos, finalInfos);
  // let oldNew = replaced(oldInfos, newInfos);
  // let newFinal = replaced(newInfos, finalInfos);
  // let uniq = uniq(oldNew, newFinal);
}

export default Mixin.create({

  willTransition(oldInfos, newInfos) {
    storeInfos(this, oldInfos, newInfos);
    this._super(...arguments);
  },

  didTransition(infos) {
    let { oldInfos, newInfos } = retreiveInfos(this)
    destroyModels(oldInfos, newInfos, mapInfos(infos));
    this._super(...arguments);
  }

});
