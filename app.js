const request = require('request');
const app = require('express')();
const port = process.env.PORT || 3000;
const api_key = process.env.api_key;
const app_id = process.env.app_id;

const AylienNewsApi = require('aylien-news-api');
const apiInstance = new AylienNewsApi.DefaultApi();

// Configure API key authorization: app_id
const app_id = apiInstance.apiClient.authentications[app_id];
app_id.apiKey = process.env.api_key;

// Configure API key authorization: app_key
var app_key = apiInstance.apiClient.authentications[app_id];
app_key.apiKey = process.env.app_id;

var opts = {
  title: 'trump',
  sortBy: 'social_shares_count.facebook',
  language: ['en'],
  notLanguage: ['es', 'it'],
  publishedAtStart: 'NOW-7DAYS',
  publishedAtEnd: 'NOW',
  entitiesBodyLinksDbpedia: [
    'http://dbpedia.org/resource/Donald_Trump',
    'http://dbpedia.org/resource/Hillary_Rodham_Clinton',
  ],
};

app.get('/', function(req, res) {
  apiInstance.listStories(opts, (err, data) => {
    if (err) res.send('There was an error with your request');
    res.json(data.stories);
  });
});

app.listen(port);
