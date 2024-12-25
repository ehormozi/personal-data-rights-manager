import { MouseEventHandler } from 'react';

export default function Button(props: {
  route?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  text: string;
  color: string;
  hover: string;
  className?: string;
}) {
  let classes =
    'py-2 px-4 text-white rounded-lg text-sm text-white ' +
    props.color +
    ' ' +
    props.hover;
  if (props.className != null) {
    classes += ' ' + props.className;
  }
  if (typeof props.route === 'string') {
    return (
      <a href={props.route}>
        <button className={classes}>{props.text}</button>
      </a>
    );
  } else if (typeof props.onClick != 'undefined') {
    return (
      <button className={classes} onClick={props.onClick}>
        {props.text}
      </button>
    );
  } else {
    return <button className={classes}>{props.text}</button>;
  }
}
