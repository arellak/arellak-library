import Entry from "./entry";
import React from "react";

import Header from "../../Header";
import Footer from "../../Footer";

import "../../styles/entries.css";

export default function Entries(props){

  function Media(){
    fetch("http://127.0.0.1:3001/getFiles", {
      method: "POST",
      body: JSON.stringify({
        session: localStorage.getItem("session")
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    return (
      <>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="entries">
        <Entry title="Entry 1" description="This is the description for entry 1." id="1" imageLink="" />

        <Media />
      </div>
      <Footer />
    </>
  );
}
