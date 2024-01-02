import { Header, Footer } from "@/_components/layout";
import Visual from "@/_components/main";

export default (): JSX.Element => {
  return (
    <>
      <Header showUser={true} />
      <Visual />
      <Footer showUser={true} />
    </>
  );
};
