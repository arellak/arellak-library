import React from "react";
import "../styles/textInput.css";

export default function TextInput(props){
  return (
    <>
      <div className="form__group field">
          <input type={props.type} className="form__field" id={props.itemId} placeholder={props.placeholder} required />
          <label htmlFor="name" className="form__label">{props.label}</label>
      </div>
    </>
  );
}