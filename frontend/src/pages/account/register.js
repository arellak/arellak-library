import React from "react";
import Cookies from "universal-cookie";
import TextInput from "../../utils/textInput";
import Button from "../../utils/button";
import "../../styles/register.css";

const cookies = new Cookies();

export default function Register(){
  async function register() {
    // @ts-ignore
    const registerEmail = document.querySelector("#registerEmail")?.value;
    // @ts-ignore
    const registerName = document.querySelector("#registerName")?.value;
    // @ts-ignore
    const registerPassword = document.querySelector("#registerPassword")?.value;

    const registerResponse = await fetch("http://127.0.0.1:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword
      })
    }).then(res => res.json());

    if(registerEmail && registerName && registerPassword){
      registerResponse.code === 200 ? console.log("VALID") : console.log("INVALID");
      cookies.set("session", registerResponse.session, { path: "/" });
      window.location.href = "/";
    }
    else {
      console.log("INVALID");
    }
  }

  return (
    <>
      <div className="register">
        <h1>Register</h1>
        <div className="registerInformation">
          <TextInput type="email" placeholder="E-Mail" label="E-Mail" itemId="registerEmail" />
          <TextInput type="text" placeholder="Username" label="Username" itemId="registerName" />
          <TextInput type="password" placeholder="Password" label="Password" itemId="registerPassword" />
        </div>
        <Button className="registerButton" title="Register" onClick={register} />
        <a href="/">Back</a>
      </div>
    </>
  );
}