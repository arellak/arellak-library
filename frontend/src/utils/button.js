import React from "react";
import "../styles/button.css"

export default function Button(props){
  return (
    <>
      <button className="button" onClick={props.onClick}>
        <span className="button-content">{props.title}</span>
      </button>
    </>
  );
}