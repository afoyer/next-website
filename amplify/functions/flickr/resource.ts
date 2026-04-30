import { defineFunction, secret } from '@aws-amplify/backend';

export const flickrFunction = defineFunction({
  name: 'flickr',
  environment: {
    FLICKR_API_KEY: secret('FLICKR_API_KEY'),
    FLICKR_API_SECRET: secret('FLICKR_API_SECRET'),
    FLICKR_USER_ID: secret('FLICKR_USER_ID'),
  },
});
