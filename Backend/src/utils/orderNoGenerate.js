const orderid =require('order-id');

const generateOrderNumber = () => {
  const id = orderid('order').generate();
  return id;
};

module.exports=generateOrderNumber;
