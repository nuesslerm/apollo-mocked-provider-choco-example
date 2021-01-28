import { OrderStatus } from '@chocoapp/appsync-client';
import React, { FC } from 'react';

type StatusProps = {
  status: OrderStatus;
  orderId?: string;
};

const NewStatus: FC<StatusProps> = ({ status, orderId }) => {
  const [orderConfirmMutation] = useBatchOrderConfirmMutation([orderId]);

  const onClickConfirmOrder = async event => {
    event.stopPropagation();

    if (!orderId) return;

    try {
      await orderConfirmMutation();
    } catch (error) {}
  };

  return (
    <div>
      {status === OrderStatus.Confirmed ? (
        <div>confirmed</div>
      ) : (
        <div onClick={onClickConfirmOrder}>confirmOrder</div>
      )}
    </div>
  );
};

export default NewStatusZ;
