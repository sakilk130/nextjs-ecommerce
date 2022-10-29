import { NextPage } from 'next';
import { IProduct } from '../../interface';
import ProductCard from '../product-card';

interface IProductItems {
  products: IProduct[];
}

const ProductItems: NextPage<IProductItems> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product: IProduct) => (
        <ProductCard key={Math.random()} product={product} />
      ))}
    </div>
  );
};

export default ProductItems;
