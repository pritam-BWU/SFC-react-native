import { Text, TextInput } from 'react-native';

const defaultFontStyle = { fontFamily: 'Poppins-Regular' };

const applyDefaultFont = (component: typeof Text | typeof TextInput) => {
  const typedComponent = component as typeof component & {
    defaultProps?: {
      style?: unknown;
      allowFontScaling?: boolean;
    };
  };

  typedComponent.defaultProps = typedComponent.defaultProps || {};
  typedComponent.defaultProps.style = [
    defaultFontStyle,
    typedComponent.defaultProps.style,
  ];
};

applyDefaultFont(Text);
applyDefaultFont(TextInput);
