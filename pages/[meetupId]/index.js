import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

//our-doman.com/new-meetup
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}
// image="https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg"
//       title="A First Meetup"
//       address="Some address 5, 1235 Some City"
//       description="This is a first meetup!"
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://user-aida:aidaturska995.@cluster0.djm6g.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); //finds all documents in collection
  // {} empty object means give me all objects - first parameter
  // second parameter is fields that we want to return - {_id: 1} only include id, not other

  client.close();
  //returns object where we describe all dynamic values
  return {
    fallback: 'blocking', // blocking - the list of paths might be bigger, might have more valid//false, //this key tells js weather all keys in ppaths have suported value or just some of them
    //false - all paths suport meetupIds values - if someone enters m3, they will see 404 errir
    //true - they will try to generate a page for this id dynamicly
    //true will immidietly return empty page, blocking user will not see anything till the page was pergenerated
    
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })), //generating array of paths dynamicly

    //[
    //   //array of versions, multiple objects, one obejct per version of dynamic page
    //   {
    //     params: {
    //       //object with all the key values that might lead to dynamic page
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
  };
}

export async function getStaticProps(context) {
  //all versions for all ids are pregenerated
  //fetch data fro single meetup
  //context will not hold request and response but it will have params key
  const meetupId = context.params.meetupId; //object where identifiers will be [] we have meetupId
  console.log(meetupId);

  const client = await MongoClient.connect(
    "mongodb+srv://user-aida:aidaturska995.@cluster0.djm6g.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
      // {
      //   image:
      //     "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
      //   id: meetupId,
      //   title: "A First Meetup",
      //   address: "Some address 5, 1235 Some City",
      //   description: "This is a first meetup!",
      // },
    },
  };
}

export default MeetupDetails;
