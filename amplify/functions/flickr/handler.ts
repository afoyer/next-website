type Event = { arguments: { albumId?: string } };

const FLICKR_BASE = 'https://www.flickr.com/services/rest/';

type FlickrSet = { id: string; title: string };
type FlickrCollection = {
  id: string;
  title: string;
  set?: FlickrSet[];
  collection?: FlickrCollection[];
};

type CollectionEntry = { id: string; title: string; parentId: string | null; depth: number; type: string };

function flattenCollections(col: FlickrCollection, parentId: string | null, depth: number): CollectionEntry[] {
  const entries: CollectionEntry[] = [{ id: col.id, title: col.title, parentId, depth, type: 'collection' }];
  for (const sub of col.collection ?? []) {
    entries.push(...flattenCollections(sub, col.id, depth + 1));
  }
  for (const set of col.set ?? []) {
    entries.push({ id: set.id, title: set.title, parentId: col.id, depth: depth + 1, type: 'set' });
  }
  return entries;
}

export const handler = async (event: Event) => {
  const apiKey = process.env.FLICKR_API_KEY!;
  const userId = process.env.FLICKR_USER_ID!;

  if (event.arguments?.albumId) {
    const params = new URLSearchParams({
      method: 'flickr.photosets.getPhotos',
      api_key: apiKey,
      photoset_id: event.arguments.albumId,
      user_id: userId,
      extras: 'url_l,height_l,width_l',
      format: 'json',
      nojsoncallback: '1',
    });
    const res = await fetch(`${FLICKR_BASE}?${params}`);
    const json = await res.json();
    return (json.photoset?.photo ?? []).map((p: {
      id: string; server: string; secret: string; title: string;
      url_l?: string; height_l?: string; width_l?: string;
    }) => ({
      id: p.id,
      server: p.server,
      secret: p.secret,
      title: p.title,
      urlL: p.url_l ?? null,
      heightL: p.height_l ? parseInt(p.height_l) : null,
      widthL: p.width_l ? parseInt(p.width_l) : null,
    }));
  }

  const params = new URLSearchParams({
    method: 'flickr.collections.getTree',
    api_key: apiKey,
    user_id: userId,
    format: 'json',
    nojsoncallback: '1',
  });
  const res = await fetch(`${FLICKR_BASE}?${params}`);
  const json = await res.json();

  const topLevel: FlickrCollection[] = json.collections?.collection ?? [];
  return topLevel.flatMap(col => flattenCollections(col, null, 0));
};
