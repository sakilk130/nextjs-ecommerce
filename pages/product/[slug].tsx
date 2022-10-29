import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../../components/layout';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';
import data from '../../utils/data';

const ProductDetails = () => {
  const { query } = useRouter();
  const { dispatch } = useContext(AppContext);

  const { slug } = query;
  const product = data.products.find((a) => a.slug === slug);

  const handleAddToCart = () => {
    dispatch({
      type: Types.CART_TO_CART,
      payload: { ...product, quantity: 1 },
    });
  };

  if (!product) {
    return <Layout title="product not found">Product Not Found</Layout>;
  }

  return (
    <Layout title={product?.name}>
      <Link href="/">
        <a>back to products</a>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 mt-2">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div className="sm:mt-4">
          <div className="card">
            <div className="p-4">
              <div className="flex justify-between">
                <p>Price</p>
                <p>${product.price}</p>
              </div>
              <div className="flex justify-between">
                <p>Status</p>
                <p>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</p>
              </div>
              <button
                className="primary-btn w-full mt-4"
                disabled={product.countInStock === 0}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
