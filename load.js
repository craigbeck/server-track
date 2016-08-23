#!/usr/bin/env node
var axios = require('axios');

const args = process.argv.slice(2);

var count;
try {
  count = parseInt(args[0], 10);
} catch (e) {
  // ignore not an int
}
if (isNaN(count)) {
  count = 12;
}

console.log(`running ${count} servers...`)

const servers = [];

for (var i = 0; i < count; i++) {
  var name = `foobar-${i}`;
  var delay = Math.floor(Math.random() * 10000);
  servers.push(new Generator(name, delay));
}

// process.on('exit', () => {
//   servers.forEach(generator => generator.cancel());
// });

function Generator(name, delay) {
  this.tid = null
  var fire = () => {
    var payload = {
      name: name,
      cpu: Math.random(),
      ram: Math.random()
    };
    axios.post('http://localhost:3001/server', payload)
      .then(() => {
        setTimeout(fire, 10000);
      })
  };
  this.tid = setTimeout(fire, delay);
}
