var cons = require('consolidate');
var _ = require('lodash');
var pokedex = require('./pokedex.json');
var nameMapping = require('./name-mapping.json');
var fs = require('fs');
var argv = require('yargs')
            .default('l', 'en')
            .argv;

var typeMapping = {
  "normal": "一般",
  "fire": "火",
  "fighting": "格斗",
  "water": "水",
  "flying": "飞行",
  "grass": "草",
  "poison": "毒",
  "electric": "电",
  "ground": "地上",
  "psychic": "超能力",
  "rock": "岩石",
  "ice": "冰",
  "bug": "虫",
  "dragon": "龙",
  "ghost": "幽灵",
  "dark": "恶",
  "steel": "钢",
  "fairy": "妖精"
};

function localize() {
  _.each(pokedex, function(p) {
    p.slugLocal = p.slug;
    p.typeLocal = p.type.slice();
    var map = nameMapping[parseInt(p.id) - 1];
    if (p.id != map.id) throw 'Invalid Mapping: ' + p.id;
    if (argv.l == 'zh') {
      p.slugLocal = map.zh;
      _.each(p.typeLocal, function(t, i) {
        p.typeLocal[i] = typeMapping[t];
      });
    }
  });
}

localize();

cons.lodash(
  'index-tmpl.html',
  {
    pokedex: pokedex
  },
  function(err, html) {
    if(err) throw err;
    var path = argv.l + '/index.html';
    fs.writeFile(path, html, function(err) {
      if (err) throw err;
      console.log('Dumped to ' + path);
    });
  })