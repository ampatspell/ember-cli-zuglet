# zuglet

``` javascript
// component.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/utils';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { root, activate, models } from 'zuglet/decorators';

@root()
export default class RouteIndexComponent extends Component {

  @service
  store

  @tracked
  first

  @tracked
  second

  @activate()
  query

  @models('query.content').named(doc => doc.data.type).mapping(doc => ({ doc })).object('data')
  models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });

    this.zeeba = this.store.document({ name: 'zeeba', type: 'zebra' });
    this.larry = this.store.document({ name: 'larry', type: 'croc' });
    setGlobal({ zeeba: this.zeeba, larry: this.larry });

    this.query = this.store.query([ this.zeeba, this.larry ]);
  }

  @action
  toggle() {
    if(this.query.content.length === 2) {
      this.query.content.removeObject(this.zeeba);
    } else {
      this.query.content.pushObject(this.zeeba);
    }
  }

  toString() {
    return `<Component:RouteIndex>`;
  }

}
```

``` javascript
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { route } from 'zuglet/decorators';

@route()
export default class OneRoute extends Route {

  @service
  store

  async model() {
    return this.store.doc('messages/one').new({ name: 'one/a' });
  }

}
```
