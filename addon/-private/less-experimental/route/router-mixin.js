import Mixin from '@ember/object/mixin';

const namesFromInfos = infos => infos.map(i => i.name);

const __zuglet = '__zuglet';

export default Mixin.create({

  willTransition(oldInfos, newInfos, transition) {
    console.log('router.willTransition', namesFromInfos(oldInfos), namesFromInfos(newInfos), transition);
    this._super(...arguments);
  },

  didTransition(infos) {
    console.log('router.didTransition', namesFromInfos(infos));
    this._super(...arguments);
  }

});
