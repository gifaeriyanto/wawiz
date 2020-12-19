import colors from 'theme/colors';
import InputTheme from 'theme/input';
import { StyleConfig } from 'theme/types';

const TextareaTheme: StyleConfig = {
  baseStyle: {
    field: {},
    addon: {},
  },
  sizes: {
    md: {},
  },
  variants: {
    outline: (InputTheme.variants.outline as any).field,
  },
  defaultProps: {
    size: 'md',
    focusBorderColor: 'gray.400',
  },
};

export default TextareaTheme;
