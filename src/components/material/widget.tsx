import { ReactNode } from 'react';

export default function Widget(props: {
  showHeader?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md space-y-4">
      {props.showHeader === false ? null : (
        <h2 className="text-lg text-black">{props.title}</h2>
      )}
      {props.children}
    </div>
  );
}
