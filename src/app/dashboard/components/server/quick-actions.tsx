import Button from '../../../../components/server/button';
import Widget from '../../../../components/server/widget';

const QuickActions: React.FC = async () => {
  const actions = [
    {
      label: 'Submit Data Request',
      color: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
    },
    {
      label: 'Review Permissions',
      color: 'bg-green-600',
      hover: 'hover:bg-green-700',
    },
    {
      label: 'View Privacy Report',
      color: 'bg-indigo-600',
      hover: 'hover:bg-indigo-700',
    },
  ];

  return (
    <Widget title="Quick Actions">
      <div className="flex flex-wrap gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            text={action.label}
            color={action.color}
            hover={action.hover}
            className="flex-1"
          />
        ))}
      </div>
    </Widget>
  );
};

export default QuickActions;
