var fs   = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var filename = path.join(__dirname, 'secrets.yml');

var Vault = {
  secrets: null,
  read: function() {
    try {
      fs.exists(filename, function(exist) {
        if(!exist){
          console.log("Initializing secrets.yml")
          this.secrets = {};
          this.save();
        }
      });

      contents = fs.readFileSync(filename, 'utf8')
      this.secrets = yaml.load(contents);
      return this.secrets;
    } catch (err) {
      return {};
    }
  },
  save: function() {
    fs.writeFile(filename, yaml.dump(this.secrets), function(err) {
      if(err) { console.log(err); }
    });
  },
  update: function(key, value) {
    console.info('updating')
    console.info([key, value]);
    console.info(this.secrets);
    this.secrets[key] = value;
    this.save();
  }
}

Vault.read();

module.exports = Vault
