import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { flickrFunction } from '../functions/flickr/resource';

const schema = a.schema({
  // ── flickr custom types ────────────────────────────────────────────────────

  FlickrAlbum: a.customType({
    id: a.string(),
    title: a.string(),
    parentId: a.string(),
    type: a.string(), // 'collection' | 'set'
  }),

  FlickrPhoto: a.customType({
    id: a.string(),
    server: a.string(),
    secret: a.string(),
    title: a.string(),
    urlL: a.string(),
    heightL: a.integer(),
    widthL: a.integer(),
  }),

  // ── flickr queries ─────────────────────────────────────────────────────────

  listAlbums: a
    .query()
    .returns(a.ref('FlickrAlbum').array())
    .handler(a.handler.function(flickrFunction))
    .authorization(allow => [allow.guest()]),

  listPhotos: a
    .query()
    .arguments({ albumId: a.string().required() })
    .returns(a.ref('FlickrPhoto').array())
    .handler(a.handler.function(flickrFunction))
    .authorization(allow => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
