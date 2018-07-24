const request = require('request');
const SpotifyWebApi = require('spotify-web-api-node');
const Clarifai = require('clarifai');
const vision = require('@google-cloud/vision');

//
// ─── GET SPOTIFY ACCESS TOKEN ───────────────────────────────────────────────────
//
const options = {
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  headers:
   {
     'Postman-Token': '226c4290-a141-4eed-aac4-17842c750d8d',
     'Cache-Control': 'no-cache',
     'Content-Type': 'application/x-www-form-urlencoded',
   },
  form:
   {
     grant_type: 'client_credentials',
     client_id: process.env.SPOTIFY_CLIENT_ID,
     client_secret: process.env.SPOTIFY_CLIENT_SECRET,
   },
};


//
// ─── SPOTIFY API ────────────────────────────────────────────────────────────────
//
let spotifyApi;
request(options, (error, response, body) => {
  if (error) throw new Error(error);
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    accessToken: JSON.parse(body).access_token,
  });
});

exports.getArtistFromSearch = term => spotifyApi.searchArtists(term)
  .then(res => res.body.artists.items[0].name);

exports.getAlbumArtByArtist = artist => spotifyApi.searchArtists(artist)
  .then(data => data.body.artists.items[0].id)
  .then(artistId => spotifyApi.getArtistAlbums(artistId, { include_groups: 'album,single', limit: 50 }))
  .then((albumsInfo) => {
    const albums = albumsInfo.body.items;

    // Filter out album duplicates
    const filtered = [];
    const seen = [];
    for (let i = 0; i < albums.length; i += 1) {
      if (!seen.includes(albums[i].name)) {
        filtered.push(albums[i]);
        seen.push(albums[i].name);
      }
    }
    return filtered.map(album => [album.name, album.images[0].url]);
  });


//
// ─── CLARIFAI API ───────────────────────────────────────────────────────────────
//
const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

exports.predictImage = imageUrl => clarifaiApp.models
  .predict(Clarifai.GENERAL_MODEL, imageUrl)
  .then(response => response.outputs[0].data.concepts.map(({ name }) => name))
  .catch(err => err);


//
// ─── GOOGLE API ─────────────────────────────────────────────────────────────────
//
const client = new vision.ImageAnnotatorClient();

exports.annotateImage = (imageUrl) => {
  client
    .labelDetection(imageUrl)
    .then((results) => {
      const labels = results[0].labelAnnotations;

      console.log('Labels:');
      labels.forEach(label => console.log(label.description));
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
};


//
// ─── CALCULATIONS ───────────────────────────────────────────────────────────────
//
exports.calcSharedElements = (traitArrays) => {
  const traits = {};
  traitArrays.forEach((cover) => {
    if (Array.isArray(cover)) {
      cover.forEach((attr) => {
        traits[attr] ? traits[attr] += 1 : traits[attr] = 1;
      });
    }
  });
  return traits;
};
