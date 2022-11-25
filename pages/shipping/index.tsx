import CheckoutSteps from '../../components/checkout-steps';
import Layout from '../../components/layout';

const Shipping = () => {
  return (
    <Layout title="Shipping">
      <CheckoutSteps activeStep={2} />
    </Layout>
  );
};

export default Shipping;
