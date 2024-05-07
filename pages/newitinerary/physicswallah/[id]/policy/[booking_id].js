import { useRouter } from "next/router";
import Policy from "../../../../../containers/policy/Index";
import Head from "next/head";

const Itinerary = () => {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title> Fare Rules | The Tarzan Way </title>
        <meta property="og:title" content="Fare Rules | The Tarzan Way" />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <script />
      </Head>

      <Policy booking_id={router.query.booking_id}></Policy>
    </div>
  );
};

export default Itinerary;
