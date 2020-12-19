import { extendTheme } from '@chakra-ui/react';
import ButtonTheme from 'theme/button';
import colors from 'theme/colors';
import InputTheme from 'theme/input';
import TextareaTheme from 'theme/textarea';

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
  },
  colors,
  fonts: {
    body: 'Work Sans, sans-serif',
    heading: 'Work Sans, sans-serif',
  },
  radii: {
    md: '4px',
  },
  styles: {
    global: {
      body: {
        color: '#363636',
        fontWeight: 500,
      },
    },
  },
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
    Textarea: TextareaTheme,
  },
});

export default theme;
