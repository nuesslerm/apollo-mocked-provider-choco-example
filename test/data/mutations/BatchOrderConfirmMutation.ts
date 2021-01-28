import gql from 'graphql-tag';

export const BatchOrderConfirmMutation = gql`
  mutation BatchOrderConfirmMutation($ids: [ID!]!) {
    batchOrderConfirm(ids: $ids) {
      ... on BatchOrderConfirmSuccess {
        responseType
        __typename
      }
      ... on BatchOrderConfirmError {
        responseType
        message
        __typename
      }
      __typename
    }
  }
`;
