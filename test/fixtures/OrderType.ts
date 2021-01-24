import { OrderStatus } from '@chocoapp/appsync-client';
import { NodeType, OrderProductType } from '.';

type OrderType = NodeType & {
  body: string;
  orderProducts: Array<OrderProductType>;
  user: {
    id: string;
    name: string;
  };
  restaurant: {
    id: string;
    restaurantName: string;
  };
  orderStatus: OrderStatus.Confirmed | null;
  deliveryDate: number;
  createdAt: number;
  pdf: string;
};

export default OrderType;
