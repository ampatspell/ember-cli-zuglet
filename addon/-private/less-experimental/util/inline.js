export default args => {
  let mixins = args.slice();
  let props = args.pop();
  return { props, mixins };
}
