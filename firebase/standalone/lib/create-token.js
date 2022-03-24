let { withContext, argv, exit } = require('./setup');

let { project, uid } = argv;
if(!project) {
  exit('--project=<id> is required');
}

if(!uid) {
  exit('--uid=<uid> is required');
}

withContext(project, async ctx => {

  console.log('projectId:', ctx.config.firebase.projectId);
  console.log('uid:', uid);

  let token = await ctx.auth.createCustomToken(uid);
  console.log();
  console.log(token);
  console.log();

});
