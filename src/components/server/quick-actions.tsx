import ComponentHeading from '../material/component-heading';

export default function QuickActions() {
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
    <div className="p-4 bg-gray-200 rounded-lg shadow-md space-y-4">
      <ComponentHeading text="Quick Actions" />
      <div className="flex flex-wrap gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex-1 py-2 px-4 text-white rounded-lg text-sm ${action.color} ${action.hover}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
