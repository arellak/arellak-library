import React from "react";
import "../../styles/account.css";
import TextInput from "../../utils/textInput";
import Button from "../../utils/button";

export default function Account(props){
  return (
    <div className="account">
      <h1>Account</h1>
      <div className="accountInformation">
        <TextInput type="email" placeholder="E-Mail" label="E-Mail" inp="" />
        <TextInput type="text" placeholder="Username" label="Username" inp="" />
        <TextInput type="password" placeholder="Password" label="Password" inp="" />
      </div>
      <Button className="saveButton" title="Save" onClick={() => { console.log("CLICK") }} />
      <a href="/" className="backButton">Home</a>
    </div>
  );
}