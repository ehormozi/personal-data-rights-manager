export default function TopNavigation(props: {
  navigation: any[];
  classNames: (arg0: string, arg1: string) => string | undefined;
}) {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        {props.navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className={props.classNames(
              item.current
                ? 'bg-gray-950 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium',
            )}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}
