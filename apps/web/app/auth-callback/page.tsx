import { log } from "@repo/logger";

import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {
  const session = await getSession();

  log("SESSION:", session);

  if (session) {
    const { user } = session;

    console.log("create user ", {
      auth0Id: user.sub,
      email: user.email,
    })
    
    // Create a new user in the database if they don't already exist
    await fetch("http://localhost:8001/users", {
      method: "PUT",
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auth0Id: user.sub,
        email: user.email,
        fard: 'asd'
      }),
    })
      .then((res) => res.json())
      .then((data) => log("API RESPONSE:", data))
      .catch((error) => {
        log("API ERROR:", error);
        redirect("/auth-error");
      });
  }

  redirect("/");
}
