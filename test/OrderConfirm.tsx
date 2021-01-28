import { OrderStatus } from '@chocoapp/appsync-client';
import React, { FC, useState } from 'react';
import useBatchOrderConfirmMutation from './data/useBatchOrderConfirmMutation';

type StatusProps = {
  status: OrderStatus;
  orderId?: string;
};

const OrderConfirm: FC<StatusProps> = ({ status, orderId }) => {
  const [orderConfirmData, setOrderConfirmData] = useState<any>(undefined);
  const [orderConfirmMutation] = useBatchOrderConfirmMutation([orderId || '']);

  const onClickConfirmOrder = async (event: any) => {
    event.stopPropagation();

    if (!orderId) return;

    try {
      const { data } = await orderConfirmMutation();
      setOrderConfirmData(data);
    } catch (error) {}
  };

  return (
    <div>
      {status === OrderStatus.Confirmed ? (
        <div>confirmed</div>
      ) : (
        <div onClick={onClickConfirmOrder}>confirmOrder</div>
      )}
      {JSON.stringify(orderConfirmData)}
    </div>
  );
};

export default OrderConfirm;
