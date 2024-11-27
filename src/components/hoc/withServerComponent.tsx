import { ComponentType } from 'react';

export function withServerComponent<P extends object>(
  ClientComponent: ComponentType<P>
): ComponentType<P> {
  const ServerComponent = async (props: P) => {
    // Create a new object with only serializable properties
    const serializableProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        Array.isArray(value) ||
        (typeof value === 'object' && value !== null && value.constructor === Object)
      ) {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<P>);

    return (
      <>
        <ClientComponent {...serializableProps as P} />
      </>
    );
  };

  return ServerComponent;
}