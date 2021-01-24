import { NodeType } from './index';

type ProductType = NodeType & {
  id: string;
  name: string;
  unit?: string;
  externalId?: string;
};

export default ProductType;
