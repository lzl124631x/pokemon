var http = require('http');
var fs = require('fs');

function padZero(x) { return ('000' + x).substr(-3); }

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

var downloadThumbnail = function(index, cb) {
  var filename = padZero(index) + '.png';
  var url = "http://assets.pokemon.com/assets/cms2/img/pokedex/detail/" + filename;
  download(url, 'thumbnail/' + filename, cb);
};

var downloadImg = function(index, cb) {
  var filename = padZero(index) + '.png';
  var url = "http://assets.pokemon.com/assets/cms2/img/pokedex/full/" + filename;
  download(url, 'full/' + filename, cb);
};

for (var i = 100; i <1000; ++i) {
  downloadImg(i + 1);
}