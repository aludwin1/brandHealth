const request = require('request');
const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
// const secrets = require('./secrets');

const AylienNewsApi = require('aylien-news-api');
const apiInstance = new AylienNewsApi.DefaultApi();

// Configure API key authorization: app_id
const app_id = apiInstance.apiClient.authentications['app_id'];
app_id.apiKey = process.env.app_id || secrets.appId;

// Configure API key authorization: app_key
const app_key = apiInstance.apiClient.authentications['app_key'];
app_key.apiKey = process.env.api_key || secrets.apiKey;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const errData = {
  top5NegativeStories: null,
  top5PositiveStories: null,
  positivePercentage: null,
  negativePercentage: null,
  negativeArticles: null,
  positiveArticles: null,
};

app.get('/', (req, res) => {
  res.send('this route does nothing');
});

app.get('/api', (req, res) => {
  const company = req.query.company || 'IBM';
  const days = req.query.days || 30;
  const positiveOpts = {
    title: company,
    sortBy: `social_shares_count.linkedin`,
    language: ['en'],
    publishedAtStart: `NOW-${days}DAYS`,
    publishedAtEnd: 'NOW',
    sentimentTitlePolarity: 'positive',
  };
  const negativeOpts = {
    title: company,
    sortBy: `social_shares_count.linkedin`,
    language: ['en'],
    publishedAtStart: `NOW-${days}DAYS`,
    publishedAtEnd: 'NOW',
    sentimentTitlePolarity: 'negative',
  };
  let negativeArticles = [];
  let positiveArticles = [];
  apiInstance.listStories(positiveOpts, (err, positiveData) => {
    if (err) res.json(errData);
    positiveData.stories.forEach(story => {
      positiveArticles.push({
        title: story.title,
        link: story.links.permalink,
        source: story.source.name,
      });
    });
    apiInstance.listStories(negativeOpts, (error, negativeData) => {
      if (error) res.json(errData);
      negativeData.stories.forEach(story => {
        negativeArticles.push({
          title: story.title,
          link: story.links.permalink,
          source: story.source.name,
        });
      });
      const dataToSend = {
        top5NegativeStories: negativeArticles.slice(0, 5),
        top5PositiveStories: positiveArticles.slice(0, 5),
        positivePercentage: (
          positiveArticles.length /
          (positiveArticles.length + negativeArticles.length)
        ).toFixed(2),
        negativePercentage: (
          negativeArticles.length /
          (positiveArticles.length + negativeArticles.length)
        ).toFixed(2),
        negativeArticles: negativeArticles.length,
        positiveArticles: positiveArticles.length,
      };
      res.json(dataToSend);
    });
  });
});

app.listen(port);
