export const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch(err) {
    return true;
  }
};
