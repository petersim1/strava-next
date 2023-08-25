import { getUser } from "@/actions";
import Connect from "@/components/pages/main/connect";
import Visual from "@/components/pages/main/visual";

export default async (): Promise<JSX.Element> => {
  const { authed } = await getUser();

  return (
    <>
      {!authed && <Connect />}
      {authed && <Visual />}
    </>
  );
};
