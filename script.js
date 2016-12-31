$(document).ready(function() {
    $('#search').on('click', function(e) {
        e.preventDefault();
        var searchWord = 'q=' + $('#request').val();
        var $content = $('#content');
        
        // var url = 'https://api.github.com/search/users?' + searchWord;
        // $.ajax({
        //   type: "GET",
        //   url: url,
        //   timeout: 2000,
        //   beforeSend: function() {
        //     $content.append('<div class="row" id="loading"><img src="loader.gif" alt="loading..."></div>')
        //   },
        //   complete: function() {
        //     $('#loading').remove();
        //   },
        //   success: function() {
        //
        //   },
        //   fail: function() {
        //     $content.append('<div class="row">Please try again!</div>');
        //   }
        // });

        $.getJSON('https://api.github.com/search/users', searchWord, function(results) {
            var itemsList = results.items;
            for (var i in itemsList) {
              var userURL = itemsList[i].url;
              $.getJSON(userURL, function(data) {
                var username = data.login;
                var profileImg = data.avatar_url;
                var profile = data.html_url;
                var fullname = data.name;
                var userEmail = data.email;
                var totalrepos = data.public_repos;
                var followers = data.followers;
                var following = data.following;

                if (fullname == undefined) {
                  fullname = username;
                }

                var info = '<div class="row result">' + '<img src="' + profileImg + '" alt="profile_image">' + '<h3>' + fullname + ' @<a href="' + profile + '" target="_blank">' + username + '</a></h3>' + '<h4>Followers: ' + followers + '<br>Following: ' + following + '<br><br><a href="mailto:' + userEmail + '">Email</a></h4>' + '<div id="fullrepos">';

                var reposURL = data.repos_url;
                var reposList;
                $.getJSON(reposURL, function(json) {
                  reposList = json;
                  outputRepos();
                });

                function outputRepos() {
                  if (reposList.length == 0) {
                    info = info + '<p>No repos!</p></div>';
                  } else {
                    info = info + '<p><strong>Repositories:</strong></p>';
                    for (var i in reposList) {
                      info = info + '<a class="btn btn-primary" href="'+reposList[i].html_url+'" target="_blank">'+reposList[i].name + '</a>';
                    }
                    info = info + '</div>';
                  }
                  $content.append(info);
                }
              });
            }
        });
    });
})
