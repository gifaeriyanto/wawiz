import { Button } from '@chakra-ui/react';
import Layouts from 'layouts';
import React, { useContext } from 'react';
import { AuthContext } from 'utils/auth';
import { auth } from 'utils/firebase';

const IndexPage: React.FC = () => {
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(undefined);
    });
  };

  return (
    <Layouts>
      <Button onClick={handleLogout}>Logout</Button>
    </Layouts>
  );
};

export default IndexPage;
