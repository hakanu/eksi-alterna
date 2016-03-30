var d;
var pageTemplate = '<script id="{slug}-template" type="text/x-template">' +
  '<h2>{title}</h2>' +
  '<p>{content}</p>' +
  '</script>';
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

jQuery( document ).ready(function( $ ) {
  console.log("started");
  var jqxhr = $.ajax('https://alterna.firebaseio.com/entry.json?orderBy="title"&limitToFirst=50')
  .done(function(data) {
    console.log(data);
    console.log(data.length);
    d = data;
    var slugDict = {};
    for (var key in data) {
      // console.log(data[key]);
      console.log(data[key].slug);
      // Render only unique slugs.
      if (slugDict[data[key].slug] == null) {
        $('#entries').append('<li><a href="/e/' + data[key].slug + '">' + data[key].title + '</a></li>');
        $('#main').append(pageTemplate.supplant({
            'title': data[key].title,
            'slug': data[key].slug,
            'content': data[key].content,
        }));
        slugDict[data[key].slug] = true;
      }
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("completed");
  });
});
