const {
  isFrozen
} = Object;

// This fixes "Cannot add property _super, object is not extensible" for A(array)
// for frozen EMPTY_ARRAY used in Ember.js ArrayMixin on removeAt()
export default array => {
  if(array && isFrozen(array) && array.length === 0) {
    return [];
  }
  return array;
};
