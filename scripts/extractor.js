var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');

String.prototype.substrAfter = function (ch) {
  return this.substr(this.lastIndexOf(ch) + 1);
};

function extractPage(name) {
  fs.readFile('pages/' + name + '.html', function read(err, data) {
    if (err) {
      throw err;
    }

    var $ = cheerio.load(data);
    var detail = { };

    detail.forms = _.map($('.profile-images>img'), function(f) {
      return $(f).attr('alt');
    });

    detail.imgs = _.map($('.profile-images>img'), function(e) {
      return $(e).attr('src').substrAfter('/');
    });

    detail.descs = _.map($('.version-descriptions p'), function(e) {
      return $(e).text().trim();
    });

    detail.abilities = _.map($('.pokemon-ability-info'), function(a) {
      var ability = {};
      _.each($('>div>ul>li', a), function(e) {
        var key = $('.attribute-title', e).text().trim();
        var valueElem = $('.attribute-value', e);
        var value;
        if (key == 'Gender') {
          value = [];
          if ($('.icon.icon_male_symbol', valueElem).length != 0) {
            value.push('Male');
          }
          if ($('.icon.icon_female_symbol', valueElem).length != 0) {
            value.push('Female');
          }
          var text = valueElem.text().trim();
          if (text) {
            value.push(text);
          }
        } else if (key == 'Abilities') {
          value = _.map(valueElem, function(e) {
            return $(e).text().trim();
          })
        } else {
          value = valueElem.text().trim();
        }
        ability[key] = value;
      });
      return ability;
    });

    detail.attributes = _.map($('.pokedex-pokemon-attributes'), function(attr) {
      return _.map($('>div', attr), function(a) {
        var obj = {};
        var key = $('h3', a).text().trim();
        var value = _.map($('li', a), function(v) {
          return $(v).text().trim();
        });
        obj[key] = value;
        return obj;
      });
    });

    function getEvolution(e) {
      var evol = {};
      evol.img = $('img', e).attr('src').substrAfter('/');
      evol.slug = $('h3', e).contents().first().text().trim();
      evol.id = $('.pokemon-number', e).text().trim().replace('#', '');
      return evol;
    }
    
    detail.evolution = _.map(
      $('.pokedex-pokemon-evolution .evolution-profile > li'),
      function(e) {
        var subEvol = $('>ul>li', e);
        if (subEvol.length != 0) {
          return _.map(subEvol, getEvolution);
        } else {
          return getEvolution(e);
        }
      });
    // console.log(JSON.stringify(detail, null, 2));

    var path = 'details/' + name + '.json';
    var file = fs.writeFile(
      path,
      JSON.stringify(detail, null, 2),
      function(err) {
        if(err) {
          return console.log(err);
        }
        console.log(path + " was saved!");
      });
  });
}

function padZero(x) { return ('000' + x).substr(-3); }

module.exports = {
  extractPages: function () {
    for (var i = 1; i < 2; ++i) {
      extractPage(padZero(i));
    }
  }
}