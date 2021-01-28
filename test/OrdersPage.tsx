import React, { FC /* useState */ } from 'react';
import useOrderSearchQuery from './fixtures/useOrderSearchQuery';

const orderSearchQueryVariables = {
  search: '',
  offset: 0,
  size: 30,
};

interface OrdersPageProps {
  ordersSearchTerm: string;
}

const OrdersPage: FC<OrdersPageProps> = ({ ordersSearchTerm }) => {
  // const [ordersSearchTerm, setOrdersSearchTerm] = useState('');

  const { orders } = useOrderSearchQuery({
    ...orderSearchQueryVariables,
    search: ordersSearchTerm,
  });
  // console.log(orders);

  return (
    <div data-testid="ordersScrollerContainer">
      <input
        type="text"
        // onChange={event => {
        //   setOrdersSearchTerm(event.target.value);
        // }}
      ></input>
      {orders.map((order: any) => (
        <div key={order.id}>{order.referenceId}</div>
      ))}
    </div>
  );
};

export default OrdersPage;
