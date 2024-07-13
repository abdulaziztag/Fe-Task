import './style.scss'
import CartListItem from "./Partials/CartListItem/index.jsx";
import CardDetails from "./Partials/CardDetails/index.jsx";
import {useState} from "react";
import {products} from "@/mock/products.js";

export const CartContainer = () => {
  const [cart, setCart] = useState([...products])

  const updateQuantityHandler = (id, newQuantity) => {
    const updatedCart = cart.map(product => {
      if (product.id === id) {
        const updatedQuantity = (product.quantity || 0) + newQuantity;
        return {
          ...product,
          quantity: Math.max(updatedQuantity, 0)
        };
      }
      return product;
    });

    setCart(updatedCart);
  };

  const deleteProductHandler = (id) => {
    const updatedCart = cart.filter(product => product.id !== id);
    setCart(updatedCart);
  }

  return (
    <div className="cart__container">
      <div className="cart__container__items">
        <h3 className="cart__container__back-btn">
          Shopping Continue
        </h3>
        <div className="divider"></div>
        <h3 className="cart__container__items__title">
          Shopping cart
        </h3>
        <p className="cart__container__items__count">You have 3 item in your cart</p>
        <ul className="cart__container__items__list">
          {cart.map((item) => (
            <CartListItem
              key={item.id}
              product={item}
              updateQuantity={(productId, quantity) => updateQuantityHandler(productId, quantity)}
              deleteProduct={(productId) => deleteProductHandler(productId)}
            />
          ))}
        </ul>
      </div>
      <CardDetails
        cart={cart.map(product => {
          return {id: product.id, price: product.price, quantity: product.quantity};
        })}
      />
    </div>
  )
}
