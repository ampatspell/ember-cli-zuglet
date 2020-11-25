import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  let k = 1024;
  let dm = decimals < 0 ? 0 : decimals;
  let sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  let value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  let size = sizes[i];
  return `${value}${size}`;
}

export default class InputFileComponent extends Component {

  @tracked
  file

  get size() {
    return formatBytes(this.file.size);
  }

  @action
  onFiles(e) {
    let files = e.target.files;
    let file = (files && files[0]) || null;
    this.file = file;
    this.args.onFile(file);
  }

}
