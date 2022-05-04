const yaml = require('js-yaml')
const fs = require('fs')

const apiUrl = () => {
  let doc
  try {
    doc = yaml.load(fs.readFileSync(__dirname + '/../../config.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  return `${doc?.c13n?.url}`;
};

module.exports ={
  apiUrl
}
