let { withContext, argv, exit } = require('./setup');

let { project, email, uid } = argv;
if(!project) {
  exit('--project=<id> is required');
}
if(!email) {
  exit('--email=<email> is required');
}
if(!uid) {
  exit('--uid=<uid> is required');
}

withContext(project, async ctx => {

  console.log('projectId:', ctx.config.firebase.projectId);
  console.log('uid:', uid);
  console.log('email:', email);

  let result = await ctx.auth.updateUser(uid, { email });
  console.log();
  console.log(result);
  console.log();

});
