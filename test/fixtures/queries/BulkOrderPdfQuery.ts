import gql from 'graphql-tag';

export const BulkOrderPdfQuery = gql`
  query BulkOrderPdfQuery($orderIds: [ID!]!, $downloadable: Boolean = true) {
    bulkOrderPdf(orderIds: $orderIds, downloadable: $downloadable)
  }
`;
