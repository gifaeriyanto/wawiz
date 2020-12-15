import colors from 'theme/colors';
import { StyleConfig } from 'theme/types';

const InputTheme: StyleConfig = {
  parts: ['field', 'addon'],
  baseStyle: {
    field: {},
    addon: {},
  },
  sizes: {
    md: {},
  },
  variants: {
    outline: {
      field: {
        h: 12,
        borderColor: 'gray.200',
        _placeholder: {
          color: 'gray.400',
        },
        _hover: {
          borderColor: 'gray.400',
        },
        _focus: {
          borderColor: 'gray.400',
          boxShadow: 'lg',
        },
        _disabled: {
          bgColor: 'gray.200',
          opacity: 1,
          _hover: {
            borderColor: 'gray.200',
          },
        },
        _invalid: {
          bgColor: `${colors?.red['100']} !important`,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: `${colors?.red['400']} !important`,
          boxShadow: 'none',
          _placeholder: {
            color: 'red.400',
          },
        },
      },
    },
  },
  defaultProps: {
    size: 'md',
    focusBorderColor: 'gray.400',
  },
};

export default InputTheme;
