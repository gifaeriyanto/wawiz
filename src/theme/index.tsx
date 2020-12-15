import { extendTheme } from '@chakra-ui/react';
import ButtonTheme from 'theme/button';
import colors from 'theme/colors';
import InputTheme from 'theme/input';

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
      },
    },
  },
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
  },
});

export default theme;
