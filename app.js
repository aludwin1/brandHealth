const request = require('request');
const app = require('express')();
const port = process.env.PORT || 3000;
const api_key = process.env.api_key;
const app_id = process.env.app_id;

const AylienNewsApi = require('aylien-news-api');
const apiInstance = new AylienNewsApi.DefaultApi();

// Configure API key authorization: app_id
const appId = apiInstance.apiClient.authentications['app_id'];
appId.apiKey = process.env.api_key;

// Configure API key authorization: app_key
const appKey = apiInstance.apiClient.authentications['app_id'];
appKey.apiKey = process.env.app_id;

const opts = {
  title: 'trump',
  sortBy: 'social_shares_count.facebook',
  language: ['en'],
  notLanguage: ['es', 'it'],
  publishedAtStart: 'NOW-7DAYS',
  publishedAtEnd: 'NOW',
};

app.get('/', function(req, res) {
  apiInstance.listStories(opts, (err, data) => {
    if (err) res.send('There was an error with your request');
    res.send(app_id);
  });
});

app.listen(port);
