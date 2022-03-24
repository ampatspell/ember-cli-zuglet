let { withContext, argv, exit } = require('./setup');

let { project, email, url } = argv;
if(!project) {
  exit('--project=<id> is required');
}
if(!email) {
  exit('--email=<email> is required');
}
if(!url) {
  exit('--url=<url> is required');
}

withContext(project, async ctx => {

  console.log('projectId:', ctx.config.firebase.projectId);
  console.log('email:', email);

  let opts = {
    handleCodeInApp: true,
    url
  };

  let result = await ctx.auth.generateSignInWithEmailLink(email, opts);
  console.log();
  console.log(result);
  console.log();

});
