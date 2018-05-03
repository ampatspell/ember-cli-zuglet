import EmberObject from '@ember/object';
import PromiseMixin from './-promise';
import { A } from '@ember/array';

const asTree = json => {
  let tree = { root: true, nodes: A() };
  json.map(item => {
    if([ 'index' ].includes(item.id)) {
      return;
    }
    let { id, headings } = item;
    let segments = id.split('/');
    let parent = tree;
    segments.forEach(segment => {
      let node = parent.nodes.findBy('segment', segment);
      if(!node) {
        let heading = item.headings[0];
        let title = (heading && heading.value) || id;
        node = { segment, id, headings, nodes: A(), title };
        parent.nodes.push(node);
      }
      parent = node;
    });
  });
  return tree;
};

export default EmberObject.extend(PromiseMixin, {

  tree: null,
  json: null,

  _deserialize(json) {
    let tree = asTree(json);
    this.setProperties({
      tree,
      json
    });
  },

  _load() {
    return this._loadJSON('/_index.json').then(json => this._deserialize(json)).then(() => this);
  }

});
