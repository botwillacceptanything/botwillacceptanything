var fs   = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var filename = path.join(__dirname, '../secrets.yml');

function prepareData(data) {
  return {
    value: data,
    modified: (new Date())
  }
}

var Vault = {
  secrets: {},
  get: function(key) {
    var entry = this.secrets[key];
    return entry && entry.value;
  },
  read: function() {
    try {
      contents = fs.readFileSync(filename, 'utf8')
      this.secrets = yaml.load(contents);
      return this.secrets;
    } catch (err) {
      fs.exists(filename, function(exist) {
        console.log("Initializing secrets.yml")
        this.secrets = {};
        this.save();
      });
      return {};
    }
  },
  save: function() {
    fs.writeFile(filename, yaml.dump(this.secrets), function(err) {
      if(err) { console.log(err); }
    });
  },
  update: function(key, value) {
    if (this.secrets[key]) { return false; }

    this.secrets[key] = prepareData(value);
    this.save();
    return true;
  }
}

module.exports = Vault
