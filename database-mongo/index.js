const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost');

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
  console.log('');
});


//
// ─── DEFINE SCHEMAS ─────────────────────────────────────────────────────────────
//
const userSchema = mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  email: String,
});

const likesSchema = mongoose.Schema({
  user_id: Number,
  labels: [{ label: String }],
});

const User = mongoose.model('User', userSchema);
const Label = mongoose.model('Label', likesSchema);


//
// ─── USERS ──────────────────────────────────────────────────────────────────────
//
userSchema.methods.validPassword = password => (
  bcrypt.compareSync(password, this.local.password)
);

const saveNewUser = (email, username, password, callback) => {
  let hashedPW;
  if (password) {
    const salt = bcrypt.genSaltSync(3);
    hashedPW = bcrypt.hashSync(password, salt);
  }
  const newUser = new User({
    email,
    username,
    password: hashedPW,
  });
  User.find({ username })
    .then((obj) => {
      if (!obj.length) {
        newUser.save((err) => {
          if (err) {
            throw err;
          } else {
            console.log('Saved user: ', newUser.username);
          }
        });
      }
    });
  callback(newUser);
};

const doesUserExist = username =>
  User.find({
    username,
  })
    .then(res => (!!res[0]._id));

//
// ─── LABELS ─────────────────────────────────────────────────────────────────────
//
const saveLike = (userId, label) => {
  console.log('saving like');
  Label.find({ user_id: userId })
    .then((res) => {
      console.log(res);
      if (res.length) {
        console.log('NEW LIKES FOR USER');
        res.labels.push({ label });
        res.save(err => console.log(err));
      } else {
        console.log('NEWLIKE-----------');
        const newLikes = new Label({
          user_id: userId,
          labels: [{ label }],
        });
        console.log(newLikes);
        newLikes.save(err => (err ? console.log(err) : console.log('Like Saved')));
      }
    });
};


module.exports = {
  User, saveNewUser, doesUserExist, saveLike,
};
