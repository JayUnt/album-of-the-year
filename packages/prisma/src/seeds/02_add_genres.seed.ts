import { prisma } from "../client";

interface Genre {
  name: string;
  aotyExternalId: string;
}
const genres: Genre[] = [
  {
    name: "Pop Rock",
    aotyExternalId: "103",
  },
  {
    name: "Pop Punk",
    aotyExternalId: "149",
  },
  {
    name: "Indie Rock",
    aotyExternalId: "1",
  }
];

const main = async () => {
  const upserts = genres.map(async (genre) => {
    return prisma.genre.upsert({
      where: { aotyExternalId: genre.aotyExternalId },
      update: genre,
      create: genre,
    });
  });

  await Promise.all(upserts);
}

export default main;
