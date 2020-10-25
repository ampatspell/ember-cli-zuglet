import Component from '@glimmer/component';

const objectToJSON = value => {
  if(value) {
    if(Array.isArray(value)) {
      return value.map(object => objectToJSON(object));
    } else if(value.serialized) {
      return value.serialized;
    }
  }
  return value;
}

export default class JsonComponent extends Component {

  get string() {
    return JSON.stringify(objectToJSON(this.args.value), null, 2);
  }

}
