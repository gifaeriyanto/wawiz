import {
  forwardRef,
  useStyleConfig,
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';

const PasswordInput = forwardRef<InputProps, 'input'>((props, ref) => {
  const { size, variant, ...rest } = props;
  const styles = useStyleConfig('PasswordInput', { size, variant });

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size={size}>
      <Input
        pr="3rem"
        type={show ? 'text' : 'password'}
        sx={styles}
        {...rest}
        ref={ref}
      />
      <InputRightElement>
        <Button
          h="1.75rem"
          size="sm"
          fontSize="xl"
          px={2}
          onClick={handleClick}
          color="gray.400"
          variant="ghost"
        >
          {show ? <RiEyeCloseLine /> : <RiEyeLine />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});

export default PasswordInput;
