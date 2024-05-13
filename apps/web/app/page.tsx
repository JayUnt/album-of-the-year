import styles from "./page.module.css";
import { AlbumCard } from "./album-card";

import { AlbumInterface } from "@repo/types";
import Header from "./common/header/header";

export default async function Page(): Promise<JSX.Element> {

  const resp = await fetch("http://localhost:8001/albums/random", {
    cache: "no-store",
  }).then((res) => res.json());
  const album = resp.data.album as AlbumInterface;
  

  return (
    <main className={styles.main}>
      <Header />
      <AlbumCard album={album} />
    </main>
  );
}
