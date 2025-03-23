import { ReactNode } from 'react';

type WhiteBoxProps = {
  children: ReactNode;
  className?: string;
};

const WhiteBox: React.FC<WhiteBoxProps> = ({ children, className }) => {
  let classes = 'bg-white rounded-lg shadow shadow-md';
  if (className != null) {
    classes += ' ' + className;
  }
  return <div className={classes}>{children}</div>;
};

export default WhiteBox;
