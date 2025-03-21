import { ReactNode } from 'react';

export default function WhiteBox(props: {
  children: ReactNode;
  className?: string;
}) {
  let classes = 'bg-white rounded-lg shadow shadow-md';
  if (props.className != null) {
    classes += ' ' + props.className;
  }
  return <div className={classes}>{props.children}</div>;
}
