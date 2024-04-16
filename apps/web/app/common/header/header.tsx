import Image from "next/image";
import { getSession } from "@auth0/nextjs-auth0";
import styles from "./header.module.css";


export default async function Header(): Promise<JSX.Element> {
  const session = await getSession();

  const HeaderItems = () => {
    if (!session) {
      return <a href="/api/auth/login">Login</a>;
    }

    const { user } = session;

    return (
      <>
        <Image src={user.picture} alt={user.name} height={16} width={16} />
        <span>{user.name}</span>
        <a href="/api/auth/logout">Logout</a>
      </>
    );
  };

  return (
    <header className={styles.header}>
      <HeaderItems />
    </header>
  )
}
