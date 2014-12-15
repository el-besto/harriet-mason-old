/*******************************************************************************
 *******************************************************************************
 **
 **  Harriet Mason's Site
 **  Developed by Angelo Cisneros 
 **  primary technologies: 
 **    node.js
 **    express.js
 **    postgres (pg)
 **    sequelize
 **    bcrypt
 **    passport && passport-local
 **    cookie-session
 **    foundation front-end framework
 **
 *******************************************************************************
*******************************************************************************/

var express        = require('express'),
    bodyParser     = require('body-parser'),
    db             = require('./models'),
    passport       = require('passport'),
    session        = require('cookie-session'),
    methodOverride = require('method-override'),
    request        = require("request"),
    tokens         = require('./config/tokens.json')
    app            = express();

/*******************************************************************************
 *******************************************************************************
 **
 ** APP SETTINGS
 **
 *******************************************************************************
*******************************************************************************/
// set default view engine to EJS
app.set( 'view engine', 'ejs');
app.use( express.static(__dirname + '/public'));
app.use( bodyParser.urlencoded( { extended:true } ));
app.use( methodOverride('_method'));

// // setup node-gallery
// app.use(gallery.middleware({static: 'resources', directory: '/photos', rootURL: "/gallery"}));

// // now, our middleware does gallery lookups for every URL under rootURL - e.g. /gallery
// app.get('/gallery*', function(req, res){
//   // We automatically have the gallery data available to us in req thanks to middleware
//   var data = req.gallery;
//   // and we can res.render using one of the supplied templates (photo.ejs/album.ejs) or one of our own
//   res.render(data.type + '.ejs', data);
// });

/*******************************************************************************
 *******************************************************************************
 **
 ** Passport Setup
 **
 *******************************************************************************
*******************************************************************************/
app.use(session({
                 secret: 'thisismysecretkey',
                 name:   'chocolate chip',
                 maxage: 3600000
                })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser  ( function (user, done) {
  console.log('Serialized just ran!');
  done(null, user.id);
});

passport.deserializeUser( function (id, done) {
  console.log('Deserialize just ran!');
  db.user
    .find({ 
      where : 
      {  id : id  }
    })
    .then( 
      function(user) {
          done(null, user);
      },
      function (err) {
           done(err, null);
      }
    );
});

/*******************************************************************************
 *******************************************************************************
 **
 ** USERS ROUTES
 **
 *******************************************************************************
*******************************************************************************/

// when a guest wants to sign up
app.get('/signup', function (req, res) {
  if ( req.user ) {
    res.render ('users/signup', { title: 'signup', user : req.user });
  } else {
    res.render ('users/signup', { title: 'signup', user : false    });
  }
});

// guest signs up to be a newUser. Creates newUser || redirects to signup page
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  console.log ("new user:", newUser);
    /*  fn from model for clarity     //
    //                                //
    //    createSecure ( email,       //
    //                   password,    //
    //                   error,       //
    //                   success      //
    //                 );             //
    //                                */
  db.user.createSecure( //email
                        newUser.email,
                        //password
                        newUser.password, 
                        //error
                        function () {
                          res.redirect("/signup");
                        },
                        //success
                        function (err, user) {
                             req.login    (user, function(){
                             console.log  ("Id: ", user.id)
                             res.redirect ('/users/' + user.id);
                        }
                      );
    })
});

// when existingUser wants login page
app.get('/login', function (req, res) {
  if ( req.user ) {
    res.render ('users/login', { title: 'login', user : req.user });
  } else {
    res.render ('users/login', { title: 'login', user : false    });
  }
});

// after existingUser signs in; routes to their profile. if(err) redirect-> signup
app.get('/users/:id', function (req, res) {
  db.user
    .find( req.params.id )
    .then( function (user) {
         res.render
         ('users/show', { user : user});
    })
    .error( function () {
          res.redirect
          ('/signup');
    })
});

// authenticating a user, relies on existing User.methods in model:User
app.post('/login', 
            passport
              .authenticate (
                  'local', { 
                      successRedirect: '/',
                        failureRedirect: '/login'
                      }
              )
        );

// when loading site root, check if Guest or User, then pass {} into site root
app.get('/', function (req, res) {
  if ( req.user ) {
    res.render ( 'site/index', { title: 'homepage', user : req.user });
  } else {
    res.render ( 'site/index', { title: 'homepage', user : false    });
  }
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

/*******************************************************************************
 *******************************************************************************
 **
 ** EVENTBRITE
 **
 *******************************************************************************
*******************************************************************************/

// when a guest visits event homepage (eventbrite api and weather underground API)
app.get('/event', function(req, res){
  var eventbriteURL = "https://www.eventbriteapi.com/v3/events/14937457337/\?token\="+tokens.eventbriteToken;
  var weatherUnderground = "http://api.wunderground.com/api/"+tokens.weatherUndergroundToken+"/conditions/q/OR/Portland.json";

  if ( req.user ) {
    request(eventbriteURL, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        var event = JSON.parse(body);
      }
      
      request(weatherUnderground, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          var weather = JSON.parse(body);
        }
        res.render('events/index', {
                                    title: 'events', 
                                    user : req.user, 
                                    event: event,
                                    weather: weather
                                   })
      })
    });
  } else {
    request(eventbriteURL, function(error, response, body) {
          if(!error && response.statusCode == 200) {
            var event = JSON.parse(body);
          }
          
          request(weatherUnderground, function(error, response, body) {
            if(!error && response.statusCode == 200) {
              var weather = JSON.parse(body);
            }
            res.render('events/index', {
                                        title: 'events', 
                                        user : false, 
                                        event: event,
                                        weather: weather
                                       })
          })
        });
  }
});

/*******************************************************************************
 *******************************************************************************
 **
 ** STATIC SITE ROUTES
 **
 *******************************************************************************
*******************************************************************************/

// when a guest visits about page
app.get('/about', function (req, res) {
  if ( req.user ) {
    res.render ('site/about', { title: 'about', user : req.user });
  } else {
    res.render ('site/about', { title: 'about', user : false    });
  }
});

// when a guest visits contact page
app.get('/contact', function (req, res) {
  if ( req.user ) {
    res.render ('site/contact', { title: 'contact', user : req.user });
  } else {
    res.render ('site/contact', { title: 'contact', user : false    });
  }
});

// when a guest visits gift homepage
app.get('/gifts', function (req, res) {
  if ( req.user ){
    res.render ('events/gifts', { title: 'gifts', user : req.user });
  } else {
    res.render ('events/gifts', { title: 'gifts', user : false });
  }
});

// when a guest visits guestbook homepage
app.get('/guestbook', function (req, res) {
  if ( req.user ){
    res.render ('events/guestbook', { title: 'guestbook', user : req.user });
  } else {
    res.render ('events/guestbook', { title: 'guestbook', user : false });
  }
});

// when a guest visits the FAQ page
app.get('/faq', function (req, res) {
  if ( req.user ){
    res.render ('events/faq', { title: 'faq', user : req.user });
  } else {
    res.render ('events/faq', { title: 'faq', user : false });
  }
});


/*******************************************************************************
 *******************************************************************************
 **
 ** START SERVER
 **
 *******************************************************************************
*******************************************************************************/
db.sequelize.sync().then( function () {
  var server = app.listen (3000, function () {
    console.log ( new Array (50).join("*") );
    console.log ( "\t listening \n\t\t localhost:3000" );
    console.log ( new Array (50).join("*") );
  });
});