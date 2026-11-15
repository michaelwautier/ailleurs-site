import { houses } from '../src/data/houses';

/** Every page of the site, relative to the base URL. */
export const pages = [
  { name: 'home', path: './' },
  ...houses.map((house) => ({ name: house.slug, path: `maisons/${house.slug}` })),
];

export const housePages = pages.filter((page) => page.name !== 'home');

export const BASE_PATH = '/ailleurs-site/';
