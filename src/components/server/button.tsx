import { MouseEventHandler } from 'react';

type ButtonProps = {
  route?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  text: string;
  color: string;
  hover: string;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  route,
  onClick,
  text,
  color,
  hover,
  className,
}) => {
  let classes =
    'py-2 px-4 text-white rounded-lg text-sm text-white ' + color + ' ' + hover;
  if (className != null) {
    classes += ' ' + className;
  }
  if (typeof route === 'string') {
    return (
      <a href={route}>
        <button className={classes}>{text}</button>
      </a>
    );
  } else if (typeof onClick != 'undefined') {
    return (
      <button className={classes} onClick={onClick}>
        {text}
      </button>
    );
  } else {
    return <button className={classes}>{text}</button>;
  }
};

export default Button;
