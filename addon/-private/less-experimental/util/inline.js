export default args => {
  let mixins = args.slice();
  let props = mixins.pop();
  return { props, mixins };
}
