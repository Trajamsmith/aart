require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const helpers = require('../lib/apiHelpers');
const db = require('../database-mongo/index');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const auth = require('../lib/auth');
const cors = require('cors');
const morgan = require('morgan');

const app = express();


//
// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────────
//
app.use(express.static(`${__dirname}/../react-client/dist`));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { },
}));
app.use(passport.initialize());
app.use(passport.session());
auth.passportHelper(passport);
app.use(flash());

app.use((req, res, next) => next());


//
// ─── GOOGLE OAUTH ENDPOINTS ─────────────────────────────────────────────────────
//
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  },
);


//
// ─── NATIVE APP ENDPOINTS ───────────────────────────────────────────────────────
//
app.get('/checklogin', (req, res) => {
  res.status(200).send(req.session.passport);
});

app.get('/subscribe', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureFlash: true,
}));

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureFlash: true,
}));

app.post('/star', (req, res) => {
  if (req.body.state) {
    db.saveLike(req.user.id, req.body.label);
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


//
// ─── GET ALBUMS AND TAGS ────────────────────────────────────────────────────────
//
app.get('/albums', (req, res) => {
  const artist = req.query.artistName;
  helpers.getAlbumArtByArtist(artist)
    .then(nameUrls => Promise.all(nameUrls.concat(nameUrls
      .map(tuple => helpers.predictImage(tuple[1])))))
    .then((urlsNotes) => {
      const length = urlsNotes.length / 2;
      const sharedEls = helpers.calcSharedElements(urlsNotes.slice(length));
      helpers.getArtistFromSearch(artist)
        .then((name) => {
          const retObj = {
            artistName: name,
            nameUrls: urlsNotes.slice(0, length),
            annotations: sharedEls,
          };
          res.status(200).send(retObj);
        });
    })
    .catch(err => console.log('Spotify API error: ', err));
});


//
// ─── START SERVER ───────────────────────────────────────────────────────────────
//
app.listen(3000, () => {
  console.log('listening on port 3000!');
  console.log('');
});
