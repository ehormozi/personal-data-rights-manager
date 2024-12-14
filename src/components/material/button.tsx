export default function Button(props: {
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
  return <button className={classes}>{props.text}</button>;
}
