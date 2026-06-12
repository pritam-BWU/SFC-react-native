import React from 'react';
import { Text, TextInput } from 'react-native';

const defaultFontStyle = { fontFamily: 'Poppins-Regular' };

const applyDefaultFont = (component: typeof Text | typeof TextInput) => {
  const typedComponent = component as typeof component & {
    defaultProps?: {
      style?: unknown;
      allowFontScaling?: boolean;
    };
    render?: (...args: unknown[]) => React.ReactElement;
  };

  typedComponent.defaultProps = typedComponent.defaultProps || {};
  typedComponent.defaultProps.style = [defaultFontStyle, typedComponent.defaultProps.style];

  if (!typedComponent.render) {
    return;
  }

  const originalRender = typedComponent.render;

  typedComponent.render = (...args: unknown[]) => {
    const element = originalRender(...args) as React.ReactElement<{
      style?: unknown;
    }>;

    return React.cloneElement(element, {
      style: [defaultFontStyle, element.props.style],
    });
  };
};

applyDefaultFont(Text);
applyDefaultFont(TextInput);
