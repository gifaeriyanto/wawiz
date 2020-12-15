import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
    <>
      <Link to="/auth">Login</Link>
      <Link to="/">Dashboard</Link>

      <br />
      <br />
      <br />

      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default IndexPage;
