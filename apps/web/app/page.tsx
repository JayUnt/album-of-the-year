import Image from "next/image";
// import { Card } from "@repo/ui/card";
// import { Code } from "@repo/ui/code";
import styles from "./page.module.css";
// import { Button } from "@repo/ui/button";
import { useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { AlbumCard } from "./album-card";

import { AlbumInterface } from "@repo/types";
import Header from "./common/header/header";

export default async function Page(): Promise<JSX.Element> {

  const resp = await fetch("http://localhost:8080/albums/random", {
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
