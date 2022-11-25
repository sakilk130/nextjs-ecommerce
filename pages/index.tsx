import Layout from '../components/layout';
import ProductItems from '../components/product-items';
import { IProduct } from '../interface';
import Product from '../models/Product';
import db from '../utils/db';

interface IHomeProps {
  products: IProduct[];
}

const Home = ({ products }: IHomeProps) => {
  return (
    <Layout title="Home Page">
      <ProductItems products={products} />
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
