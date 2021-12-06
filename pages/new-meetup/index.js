// our-domain.com/new-meetup
import { useRouter } from "next/router";
import { Fragment } from "react";
import Head from "next/head";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage() {
  const router = useRouter();
  async function addMeetupHandler(enteredMeetupData) {
    //console.log(enteredMeetupData);
    //here we want to send data to ip route
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    }); //place where our api folder is /api/new-meetup

    const data = await response.json();
    console.log(data);

    router.push("/");
  }
  return (
    <Fragment>
      <Head>
      <title>Add a new meetup</title>
        <meta
          name="description"
          content="Add your own meetups"
        />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  );
}

export default NewMeetupPage;
