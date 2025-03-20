import { ReactNode } from 'react';

export default function Widget(props: {
  showHeader?: boolean;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  let classes = 'p-4 bg-gray-200 rounded-lg shadow-md space-y-4';
  if (props.className != null) {
    classes += ' ' + props.className;
  }
  return (
    <div className={classes}>
      {props.showHeader === false ? null : (
        <h2 className="text-lg font-semibold text-gray-800">{props.title}</h2>
      )}
      {props.children}
    </div>
  );
}
