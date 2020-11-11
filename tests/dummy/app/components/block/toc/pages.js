import Component from '@glimmer/component';
import { sortBy } from 'macro-decorators';

export default class BlockTocPagesComponent extends Component {

  @sortBy('args.page.pages', 'pos')
  pages

}
