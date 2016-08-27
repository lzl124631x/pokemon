var http = require('http');
var fs = require('fs');
var _ = require('lodash');
var pokedex = require('./pokedex.json');

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(
    url,
    function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);
      });
    });
};

var downloadPage = function(pokemon, cb) {
  var filename = 'pages/' + pokemon.id + '.html';
  var url = "http://www.pokemon.com/us/pokedex/" + pokemon.slug;
  download(url, filename, cb);
};

_.each(pokedex, function(p) {
  downloadPage(p);
});