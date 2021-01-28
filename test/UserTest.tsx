import React from 'react';
import { gql, useQuery } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      id
      name
      phone
      pending
    }
  }
`;

export interface GetUser {
  user: {
    id: string;
    name: string;
    phone: string;
    pending: boolean | null;
  };
}

const UserTest = ({ id }: { id: string }) => {
  const { loading, error, data } = useQuery<GetUser>(GET_USER_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! ({error.message})</p>;
  return <>{data && <ul data-testid="usertest">{data.user.name}</ul>}</>;
};

export default UserTest;
