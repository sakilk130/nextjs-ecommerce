const CheckoutSteps = ({ activeStep }: any) => {
  const steps = ['Sign In', 'Shipping', 'Payment', 'Place Order'];
  return (
    <div className="flex justify-between">
      {steps.map((step: string, index: number) => (
        <div
          key={step}
          className={`lg:text-lg bottom-2 w-[100%] flex justify-center border-b-2 ${
            activeStep >= index
              ? 'border-yellow-400 text-yellow-400'
              : 'text-gray-400'
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
