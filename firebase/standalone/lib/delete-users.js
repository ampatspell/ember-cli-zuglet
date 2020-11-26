let { withContext, argv, exit } = require('./setup');

let project = argv.project;
if(!project) {
  exit('--project=<id> is required');
}

withContext(project, async ctx => {

  console.log('projectId:', ctx.config.firebase.projectId);

  let withUsers = async cb => {
    let pageToken;
    do {
      console.log('•', pageToken);
      let res = await ctx.auth.listUsers(1000, pageToken);
      pageToken = res.pageToken;
      await cb(res.users);
    } while(pageToken);
  }

  await withUsers(async users => {
    let uids = users.filter(user => {
      if(!user.email) {
        return true;
      }
      if(user.email.startsWith('test-')) {
        return true;
      }
      if(user.email.startsWith('ampatspell+')) {
        return true;
      }
    }).map(user => user.uid);
    await ctx.auth.deleteUsers(uids);
  });

});
