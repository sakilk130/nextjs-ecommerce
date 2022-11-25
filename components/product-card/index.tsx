import axios from 'axios';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/context';
import { Types } from '../../context/type';

const ProductCard: NextPage<any> = ({ product }) => {
  const { state, dispatch } = useContext(AppContext);

  const handleAddToCart = async () => {
    const existItem = state.cart.cartItems.find(
      (x) => x.slug === product?.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({
      type: Types.CART_TO_CART,
      payload: { ...product, quantity: quantity },
    });
    toast.success('Product added to the cart');
  };

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            alt={product.name}
            className="rounded shadow object-cover h-64 w-full"
            loading="lazy"
            layout="responsive"
            height={300}
            width={300}
            placeholder="blur"
            blurDataURL={product.image}
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
