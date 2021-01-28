import { useMutation } from '@apollo/client';
import { BatchOrderConfirmResponse } from '@chocoapp/appsync-client';
import { BatchOrderConfirmMutation } from './mutations/BatchOrderConfirmMutation';

type BatchOrderConfirmMutationType = {
  batchOrderConfirm?: BatchOrderConfirmResponse;
};

type BatchOrderConfirmMutationVariablesType = {
  ids: string[];
};

export default function useBatchOrderConfirmMutation(orderIds: string[]) {
  return useMutation<
    BatchOrderConfirmMutationType,
    BatchOrderConfirmMutationVariablesType
  >(BatchOrderConfirmMutation, {
    variables: { ids: orderIds },
  });
}
