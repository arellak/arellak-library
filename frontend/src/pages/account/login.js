import React from "react";
import Cookies from "universal-cookie";
import "../../styles/login.css";
import TextInput from "../../utils/textInput";
import Button from "../../utils/button";

const cookies = new Cookies();

export default function Login(props){
  async function checkLogin(){
    // @ts-ignore
    const loginEmail = document.querySelector("#email")?.value;
    // @ts-ignore
    const loginPassword = document.querySelector("#password")?.value;

    const loginResponse = await fetch("http://127.0.0.1:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
        session: cookies.get("session")
      })
    }).then(res => res.json());

    if(loginResponse.session !== undefined && loginResponse.session !== ""){
      cookies.set("session", loginResponse.session, { path: "/" });
      window.location.href = "/";
    }
    else {
      document.querySelector(".loginError")?.setAttribute("style", "display: block; color: red;");
      console.log("INVALID");
    }
  }

  function Login(){
    if(cookies.get("session") !== undefined && cookies.get("session") !== ""){
      return (
        <>
          <div className="container">
            <h1>Login</h1>
            <p>You are already logged in!</p>
            <Button onClick={() => { window.location.href = "/" }} title="Go Home" />
          </div>
        </>
      );
    }
    else {
      return (
        <>
          <div className="container">
            <h1>Login</h1>
            <p>Log in to view protected content</p>
            <label htmlFor="email">E-Mail</label>
            <TextInput type="email" placeholder="E-Mail" itemId="email" label="E-Mail" />
            <br />
            <label htmlFor="password">Password</label>
            <TextInput type="password" placeholder="Password" itemId="password" label="Password" />
            <br />
            <span className="loginError" style={{ display: "none" }}>
              <p>Invalid E-Mail or Password</p>
              <br />
            </span>
            <Button onClick={checkLogin} title="Login" />
            <a href="/">Back</a>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <Login />
    </>
  );
}