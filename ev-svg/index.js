var fs = require('fs');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('lodash');

var indexes = [1, 2, 3];
var names = ['bulbasaur', 'ivysaur', 'venusaur'];
var pokemonFileTmpl = _.template('../svg/<%= index %>.svg');
var shadeFileTmpl = _.template('../shade-svg/<%= index %>.svg');
var pokemonFiles = _.map(indexes, i => pokemonFileTmpl({index : i}));
var shadeFiles = _.map(indexes, i => shadeFileTmpl({index : i}));
async.map([shadeFiles, pokemonFiles],
  function(files, callback) {
    async.map(files, function(file, callback) {
      fs.readFile(file, 'utf8', callback);
    }, callback);
  },
  function(err, data) {
    if (err) throw err;
    var shades = _.map(data[0], function(svg, i) {
      var $ = cheerio.load(svg);
      return $.html($('path').addClass('shade ' + names[i]));
    });
    var pokemons = _.map(data[1], function(svg, i) {
      var $ = cheerio.load(svg);
      return $.html($('g').addClass(names[i]));
    });
    var writeData = shades.concat(pokemons).join('\n');
    var filename = names[0] + '-ev.svg'
    fs.writeFile(filename, writeData, 'utf8', function(err) {
      if (err) throw err;
      console.log('Saved as', filename);
    });
  });