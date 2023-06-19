import React from "react";
import Cookies from "universal-cookie";

import "../styles/upload.css";
import Button from "./button";

const cookies = new Cookies();

export default function Upload(){
  function handleUpload(){
    document.querySelector(".waiting")?.setAttribute("style", "visibility: visible;");
    const session = cookies.get("session") ?? "";
    if(!!session){
      document.querySelector(".waiting")?.setAttribute("style", "visibility: hidden;");
      document.querySelector(".error")?.setAttribute("style", "visibility: visible;");
      return;
    }
    
    // @ts-ignore
    const file = document.querySelector(".fileUpload")?.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:3001/fileUpload?session=" + session, {
      method: "POST",
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".waiting")?.setAttribute("style", "visibility: hidden;");
      document.querySelector(".success")?.setAttribute("style", "visibility: visible;");
      clearUpload();
      console.log(data);
    })
    .catch((error) => {
      document.querySelector(".waiting")?.setAttribute("style", "visibility: hidden;");
      document.querySelector(".error")?.setAttribute("style", "visibility: visible;");
      console.log(error);
    });
  }

  function Show(){
    if(cookies.get("session")){
      return (
        <>
          <div className="uploader">
            <label htmlFor="images" className="drop-container">
              <span className="drop-title">Upload file</span>
              <input type="file" className="fileUpload" required />
            </label>
            <br />
            <Button title="Upload" onClick={handleUpload} />
            <span className="statusMessage">
              <p className="waiting" style={{visibility: "hidden"}}>Uploading...</p>
              <p className="success" style={{visibility: "hidden"}}>Upload successful!</p>
              <p className="error" style={{visibility: "hidden"}}>Upload failed!</p>
            </span>
          </div>
        </>
      );
    }
    else{
      return (
        <>
          <div className="uploadLogin">
            <p>You need to be logged in to upload files.</p>
            <a href="/login">Login</a>
          </div> 
        </>
      );
    }
  }

  function clearUpload(){
    const oldInput = document.querySelector(".fileUpload");
    const newInput = document.createElement("input");
    newInput.type = "file";
    newInput.className = "fileUpload";
    newInput.required = true;

    oldInput?.parentNode?.replaceChild(newInput, oldInput);
  }

  return (
    <>
      <Show />
    </>
  );
}