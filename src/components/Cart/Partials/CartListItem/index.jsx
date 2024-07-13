import './style.scss'

const CartListItem = ({ product, updateQuantity, deleteProduct }) => {
  return (
    <li className="product">
      <img src={product.image} className="product__image" alt="pizza"/>
      <div className="product__info">
        <h3 className="product__info__title">
          {product.title}
        </h3>
        <p className="product__info__description">
          {product.description}
        </p>
      </div>
      <div className="product__quantity">
        <p className="product__quantity__count">{product.quantity}</p>
        <div className="product__quantity__actions">
          <div className="increase" onClick={() => updateQuantity(product.id, 1)}></div>
          <div className="decrease" onClick={() => updateQuantity(product.id, -1)}></div>
        </div>
      </div>
      <div className="product__price">
        ${product.price * product.quantity}
      </div>
      <div className="product__remove" onClick={() => deleteProduct(product.id)}>
      </div>
    </li>
  )
}
 export default CartListItem;
