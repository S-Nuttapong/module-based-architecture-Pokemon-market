type ColumnComponent = (props: { id: string }) => JSX.Element;

/**
 * identity function to help guide creating cart sub component
 */
export const miniCartChildFactory = (fnComponent: ColumnComponent) =>
  fnComponent;
