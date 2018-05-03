import EmberObject from '@ember/object';
import PromiseMixin from './-promise';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';

const sortByPos = tree => {
  tree.nodes = tree.nodes.sortBy('pos');
  tree.nodes.forEach(node => sortByPos(node));
  return tree;
};

const asTree = json => {
  let tree = { root: true, nodes: A() };
  json.map(item => {
    let { id, headings, frontmatter: { hidden, title, pos } } = item;

    if(hidden) {
      return;
    }

    let segments = id.split('/');
    let parent = tree;
    segments.forEach(segment => {
      let node = parent.nodes.findBy('segment', segment);
      if(!node) {
        node = { segment, id, nodes: A() };
        parent.nodes.push(node);
      }
      parent = node;
    });


    if(!title) {
      let heading = item.headings[0];
      title = heading && heading.value;
    }

    if(!title) {
      title = id;
    }

    assign(parent, { headings, title, pos });
  });

  return sortByPos(tree);
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
