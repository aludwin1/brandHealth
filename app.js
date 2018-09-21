const request = require('request');
const app = require('express')();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const secrets = require('./secrets');
const { promisify } = require('util');

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

const promisifiedAylienCall = (opts, func) => {
  apiInstance.listStories(opts, func);
  return 'done';
};
const listStoriesAsync = promisify(promisifiedAylienCall);

app.get('/', async (req, res) => {
  const positiveOpts = {
    title: 'ibm',
    sortBy: `social_shares_count.linkedin`,
    language: ['en'],
    publishedAtStart: `NOW-30DAYS`,
    publishedAtEnd: 'NOW',
    sentimentTitlePolarity: 'positive',
  };
  const negativeOpts = {
    title: 'ibm',
    sortBy: `social_shares_count.linkedin`,
    language: ['en'],
    publishedAtStart: `NOW-30DAYS`,
    publishedAtEnd: 'NOW',
    sentimentTitlePolarity: 'negative',
  };
  let negativeArticles = [];
  let positiveArticles = [];
  apiInstance.listStories(positiveOpts, (err, positiveData) => {
    if (err) console.error('err');
    positiveData.stories.forEach(story => {
      positiveArticles.push({
        title: story.title,
        link: story.links.permalink,
        source: story.source.name,
      });
    });
    apiInstance.listStories(negativeOpts, (error, negativeData) => {
      if (error) console.error('err');
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
        positivePercentage:
          positiveArticles.length /
          (positiveArticles.length + negativeArticles.length),
        negativePercentage:
          negativeArticles.length /
          (positiveArticles.length + negativeArticles.length),
        negativeArticles: negativeArticles.length,
        positiveArticles: positiveArticles.length,
      };
      res.json(dataToSend);
    });
  });
});

app.listen(port);
