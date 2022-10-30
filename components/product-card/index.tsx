import { NextPage } from 'next';
import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';
import { IProduct } from '../../interface';
interface IProductCard {
  product: IProduct;
}
const ProductCard: NextPage<IProductCard> = ({ product }) => {
  const { state, dispatch } = useContext(AppContext);

  const handleAddToCart = () => {
    const existItem = state.cart.cartItems.find(
      (x) => x.slug === product?.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product && product?.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({
      type: Types.CART_TO_CART,
      payload: { ...product, quantity: 1 },
    });
  };

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          {/* TODO: change img to next/image component */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={product.image}
            alt={product.name}
            className="rounded shadow object-cover h-64 w-full"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center mt-4 mb-4">
        <p>{product.name}</p>
        <p>{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-btn"
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          Add to card
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
