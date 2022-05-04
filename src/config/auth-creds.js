const attemptUsernameRead = () => {
  let doc
  try {
    doc = yaml.load(fs.readFileSync(__dirname + '/../../config.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  return doc?.c13n?.username;
};

const attemptPasswordRead = () => {
  let doc
  try {
    doc = yaml.load(fs.readFileSync(__dirname + '/../../config.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  return doc?.c13n?.password;
};

const authCreds = () => {
  // console.log({"Authorization": 'Basic ' + Buffer.from(`${attemptUsernameRead()}:${attemptPasswordRead()}`).toString('base64')})
  return {"Authorization": 'Basic ' + Buffer.from(`${attemptUsernameRead()}:${attemptPasswordRead()}`).toString('base64')};
};

module.exports = {
  authCreds
}
