import addGenres from './seeds/02_add_genres.seed'

const seeds: (() => Promise<void>)[] = [
    addGenres
]

const main = async () => {
    for (const seed of seeds) {
        await seed();
    }
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
