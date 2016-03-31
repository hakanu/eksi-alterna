var d;
var pageTemplate = '<script id="{slug}-template" type="text/x-template">' +
  '<h2>{title}</h2>' +
  '<p>{content}</p>' +
  '<sub><a href="/index.html?q={slug}">{date}</a> | <a href="/index.html?u={author}">{author}</a></sub>' +
  '</script>';
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function getEntryList() {
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
        $('#entries').append('<li><a href="/index.html?q=' + data[key].slug + '">' + data[key].title + '</a></li>');
        $('#main').append(pageTemplate.supplant({
            'title': data[key].title,
            'slug': data[key].slug,
            'content': data[key].content,
            'date': data[key].date,
            'author': data[key].author,
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
}

function getEntry(slug) {
  var jqxhr = $.ajax('https://alterna.firebaseio.com/entry.json?slug=' + slug + '&orderBy="title"&limitToFirst=20')
  .done(function(data) {
    console.log(data);
    console.log(data.length);
    for (var key in data) {
      // console.log(data[key]);
      console.log(data[key].slug);
      $('#main').append(pageTemplate.supplant({
          'title': data[key].title,
          'slug': data[key].slug,
          'content': data[key].content,
      }));
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("completed");
  });
}

function getQueryVariable(query, variable) {
  // var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
          return decodeURIComponent(pair[1]);
      }
  }
  console.log('Query variable %s not found', variable);
}

// function getSlugFromQuery() {
//   console.log('Checking query');
//   var query = window.location.search.substring(1);
//   console.log('query: ' + query);
//   return
// }

function showActiveLink(ctx, next) {
  deactiveate();
  a(ctx.path).parentNode.classList.add('active');
  next();
}

function showEntry(ctx) {
  console.log("showing entry");
  render(template(ctx.params.slug), !ctx.init);
}

function showEntryFromGetParam(ctx) {
  console.log("showing entry from get param");
  slug = getQueryVariable(ctx.querystring, 'q');
  console.log('requested slug: ' + slug);
  render(template(slug), !ctx.init);
}

function showDescription(ctx) {
  console.log("showing description");
  render(template('description'), !ctx.init);
}

function notfound(ctx) {
  render(template('not-found'), !ctx.init);
}

function render(html, hide) {
  var el = document.getElementById('content');
  if (hide) {
    el.classList.add('hide');
    setTimeout(function(){
      el.innerHTML = html;
      el.classList.remove('hide');
    }, 300);
  } else {
    el.innerHTML = html;
  }
}

function deactiveate() {
  var el = document.querySelector('.active')
  if (el) el.classList.remove('active');
}

function a(href) {
  return document.querySelector('[href=".' + href + '"]');
}

function template(name) {
  return document
    .getElementById(name + '-template')
    .innerHTML;
}

jQuery( document ).ready(function( $ ) {
  console.log("started");
  getEntryList();
  var slug = getQueryVariable(window.location.search.substring(1), 'q');
  if (slug) {
    getEntry(slug);
    // render(template(slug));
  } else {
    console.log("no get params");
  }

  page.base('/');
  // page('*', showActiveLink);
  page('/', showDescription);
  page('/e/:slug', showDescription);
  page('e/:slug', showEntry);
  page('index.html', showEntryFromGetParam);
  page('*', showDescription);
  page();


});
