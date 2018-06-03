export default instance => {
  // https://github.com/emberjs/ember.js/issues/10742
  return instance._debugContainerKey;
}
