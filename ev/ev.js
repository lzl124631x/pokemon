var fs = require('fs');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('lodash');

var ev =   {
    ids: [172, 25, 26],
    names: ['pichu', 'pikachu', 'raichu']
  };
var pokemonFileTmpl = _.template('../svg/<%= index %>.svg');
var shadeFileTmpl = _.template('../shade-svg/<%= index %>.svg');
var pokemonFiles = _.map(ev.ids, i => pokemonFileTmpl({index : i}));
var shadeFiles = _.map(ev.ids, i => shadeFileTmpl({index : i}));
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
      var name = ev.names && ev.names[i] || '';
      return $.html($('path').addClass('shade ' + name + ' ' + ev.ids[i]));
    });
    var pokemons = _.map(data[1], function(svg, i) {
      var $ = cheerio.load(svg);
      var name = ev.names && ev.names[i] || '';
      return $.html($('g').addClass(name + ' ' + ev.ids[i]));
    });
    var writeData = '<svg>' + shades.concat(pokemons).join('\n') + '</svg>';
    var filename = 'output/' + ev.names[0] + '-ev.svg'
    fs.writeFile(filename, writeData, 'utf8', function(err) {
      if (err) throw err;
      console.log('Saved as', filename);
    });
  });