"use client";

import styles from "./styled.module.css";

const CALLBACK = "/api/auth/callback";

export default ({ url }: { url: string }): JSX.Element => {
  // localhost is whitelisted.
  // const urlUse = new URL("https://www.strava.com/oauth/mobile/authorize");
  const search = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
    redirect_uri: url + CALLBACK,
    response_type: "code",
    approval_prompt: "force",
    scope: "activity:read",
  });
  // will require patch, should accept a URLSearchParams object.
  let urlUse = new URL("strava://oauth/mobile/authorize");
  urlUse.search = search.toString();
  const onClick = (): void => {
    const now = new Date().valueOf();
    setTimeout(function () {
      if (new Date().valueOf() - now > 100) return;
      urlUse = new URL("https://www.strava.com/oauth/mobile/authorize");
      urlUse.search = search.toString();
      document.location.href = urlUse.toString();
    }, 25);
    document.location.href = urlUse.toString();
  };

  return (
    <a href="#" onClick={onClick} className={styles.connect_link}>
      <div className={styles.connect} />
    </a>
  );
};
