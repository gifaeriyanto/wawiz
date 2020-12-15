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
    link: {
      fontWeight: '500',
    },
  },
  defaultProps: {
    size: 'md',
  },
};

export default ButtonTheme;
