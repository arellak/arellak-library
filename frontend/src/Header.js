import React from "react";
import Cookies from "universal-cookie";
import "./styles/header.css";

const cookies = new Cookies();

export default function Header(props){
  const [validSession, setValidSession] = React.useState(false);


  function logout(){
    cookies.remove("session", { path: "/" });
    window.location.href = "/";
  }

  function ShowMenu(){
    if(cookies.get("session") !== undefined && cookies.get("session") !== ""){
      fetch("http://127.0.0.1:3001/validateSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session: cookies.get("session")
        })
      }).then(res => res.json()).then(res => {
        if(res.statusCode === 200){
          setValidSession(true);
        }
        else {
          setValidSession(false);
        }
      });
    }

    if(validSession){
      return (
        <>
          <ul className="header">
            <li className="headerElement"><a href="/">Home</a></li>
            <li className="headerElement"><a href="/entries">Entries</a></li>
            <li className="headerElement"><a href="/upload">Upload</a></li>
            <li className="headerElement"><a href="/" onClick={logout}>Logout</a></li>
          </ul>
        </>
      );
    }
    else {
      return (
        <>
          <ul className="header">
            <li className="headerElement"><a href="/">Home</a></li>
            <li className="headerElement"><a href="/login">Login</a></li>
            <li className="headerElement"><a href="/register">Register</a></li>
          </ul>
        </>
      );
    }
  }

  return (
    <>
      <ShowMenu />
    </>
  );
}