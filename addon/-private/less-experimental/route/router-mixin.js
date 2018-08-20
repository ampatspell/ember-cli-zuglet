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

const replaced = (source, target) => {
  let arr = [];
  for(let i = 0; i < source.length; i++) {
    let s = source[i];
    let t = target[i];
    if(!t || s.name !== t.name || s.model !== t.model) {
      arr.push(s);
    }
  }
  return arr;
}

const unique = (first, second) => {
  let arr = [];
  console.log(first, second);
  return arr;
}

const destroyModels = (oldInfos, newInfos, finalInfos) => {
  console.log('-------------------------------------------------');
  console.log('old: ', oldInfos);
  console.log('new: ', newInfos);
  console.log('fnl: ', finalInfos);
  let infos = unique(replaced(oldInfos, finalInfos), replaced(oldInfos, newInfos));
  console.log(infos);
}

export default Mixin.create({

  willTransition(oldInfos, newInfos) {
    // console.log('will', mapInfos(oldInfos), mapInfos(newInfos));
    // storeInfos(this, oldInfos, newInfos);
    this._super(...arguments);
  },

  didTransition(infos) {
    // console.log('did', mapInfos(infos));
    // let { oldInfos, newInfos } = retreiveInfos(this)
    // destroyModels(oldInfos, newInfos, mapInfos(infos));
    this._super(...arguments);
  }

});
