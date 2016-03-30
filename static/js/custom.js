var d;
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
        $('#entries').append('<li><a href="/entry.html?q=' + data[key].slug + '">' + data[key].title + '</a></li>');
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
