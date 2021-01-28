import { ProductType } from '.';

type OrderProductType = {
  __typename: string;
  amount: number;
  product: ProductType;
};

export default OrderProductType;
