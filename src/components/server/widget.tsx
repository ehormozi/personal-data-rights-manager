import { ReactNode } from 'react';

type WidgetProps = {
  showHeader?: boolean;
  title?: string;
  children: ReactNode;
  className?: string;
};

const Widget: React.FC<WidgetProps> = ({
  showHeader,
  title,
  children,
  className,
}) => {
  let classes = 'p-4 bg-gray-200 rounded-lg shadow-md space-y-4';
  if (className != null) {
    classes += ' ' + className;
  }
  return (
    <div className={classes}>
      {showHeader === false ? null : (
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default Widget;
