import { prisma, Prisma } from "./client";

const artistData: Prisma.ArtistCreateInput = {
  name: "Green Day",
  aotyExternalId: "137",
};
const albumData: Prisma.AlbumCreateInput[] = [
  {
    title: "Saviors",
    aotyExternalId: "778158",
  },
  {
    title: "Dookie",
    aotyExternalId: "3933",
  },
];

async function main() {
  const artist = await prisma.artist.create({
    data: artistData,
  });

  for (const album of albumData) {
    await prisma.album.create({
      data: {
        ...album,
        artist: {
            connect: { id: artist.id },
        }
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
