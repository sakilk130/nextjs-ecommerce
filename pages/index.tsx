import type { NextPage } from 'next';
import Layout from '../components/layout';
import ProductItems from '../components/product-items';
import data from '../utils/data';

const Home: NextPage = () => {
  const { products } = data;

  return (
    <Layout title="Home Page">
      <ProductItems products={products} />
    </Layout>
  );
};

export default Home;
