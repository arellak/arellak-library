import React from 'react';

export default function Entry(props){
  return (
    <div className={`entry-${props.id}`} id="entry">
      <h2 className={`entry-title`} id="entry-title"><a href={`/entries/entry-${props.id}`} id="entry-link" className={`entry-link-${props.id}`}>{props.title}</a></h2>
      <img src={props.imageLink} alt="alt text"></img>
      <p className={`entry-description-${props.id}`} id="entry-description">{props.description}</p>
      <ul className={`entry-tags-${props.id}`} id="entry-tags">
      </ul>
    </div>
  );
}
