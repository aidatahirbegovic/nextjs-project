import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 5, 1235 Some City",
    descrition: "This is a first meetup!",
  },
  {
    id: "m2",
    title: "A Second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
    address: "Some address 10, 1235 Some City",
    descrition: "This is a second meetup!",
  },
];

function HomePage(props) {
  //const [loadedMeetups, setLoadedMeetups] = useState([]);

  // useEffect(() => {
  //     //send http request and fetch data
  //     setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse huge list of highly ative React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req; //request object - for authentication it can be usefull
//   const res = context.res; //response

//   //fetch data from file, always runs on server never on client
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //fetch data from API, database

  const client = await MongoClient.connect(
    "mongodb+srv://user-aida:aidaturska995.@cluster0.djm6g.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray(); //finds all documents in collection

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })), //DUMMY_MEETUPS ,
    }, //it will fetch data as props, thats why we not longer need useState or useEffect
    revalidate: 1, // wants a number, 10 is number of seconds, not be generated just during the build proccess, but it will also be generated every couple of seconds
  };
}

export default HomePage;
