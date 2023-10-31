import { getUser } from "@/_actions";
import Connect from "@/_components/pages/main/connect";
import Visual from "@/_components/pages/main/visual";

export default async (): Promise<JSX.Element> => {
  const { authed } = await getUser();
  return (
    <>
      {!authed && <Connect />}
      {authed && <Visual />}
    </>
  );
};
