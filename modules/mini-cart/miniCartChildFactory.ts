type ColumnComponent = (props: { id: string }) => JSX.Element;

export const miniCartChildFactory = (fnComponent: ColumnComponent) =>
  fnComponent;
