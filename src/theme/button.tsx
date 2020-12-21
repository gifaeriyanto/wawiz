import { StyleConfig } from 'theme/types';

const ButtonTheme: StyleConfig = {
  baseStyle: {
    _focus: {
      boxShadow: 'lg',
    },
  },
  sizes: {
    md: {
      px: '30px',
      py: '16px',
      h: 'auto',
    },
  },
  variants: {
    ghost: {
      _focus: {
        boxShadow: 'none',
      },
    },
  },
  defaultProps: {
    size: 'md',
  },
};

export default ButtonTheme;
