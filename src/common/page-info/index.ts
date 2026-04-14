type PageInfo =
  | {
      title: string;
      description: string;
      link: string;
      image?: string;
    }
  | { type: string; items: PageInfo[] };

export const pageInfo: PageInfo[] = [
  {
    title: "About",
    description: "About",
    link: "/about",
    image: "/public/about/1.jpg",
  },
  {
    title: "Photos",
    description: "Photos",
    link: "/photos",
    image: "/public/photos/1.jpg",
  },
  {
    type: "Projects",
    items: [
      {
        title: "Pantonify",
        description: "Pantonify",
        link: "/projects/pantonify",
        image: "/public/pantonify/1.jpg",
      },
    ],
  },
  {
    type: "Work",
    items: [
      {
        title: "Amazon",
        description: "Amazon",
        link: "/work/amazon",
        image: "/public/amazon/1.jpg",
      },
    ],
  },
];
