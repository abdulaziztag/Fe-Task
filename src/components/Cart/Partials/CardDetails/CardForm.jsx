import {cardValidationSchema} from "@/utils/cardValidation.js";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {InputMask} from "@react-input/mask";
import {useEffect, useState} from "react";
import {SHIPPING_COST, TAX_RATE} from "@/mock/products.js";
import {getSetting, openIndexedDB, putSetting} from "@/utils/IndexedDBOperations.js";

const CardForm = ({cart, cardType}) => {
  const [subTotal, setSubTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(null);
  const [taxRate, setTaxRate] = useState(null);

  useEffect(() => {
    setSubTotal(cart.reduce((acc, product) => acc + product.price * product.quantity, 0));
  }, [cart]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const db = await openIndexedDB("AppDatabase", 1);
        let fetchedShippingCost = await getSetting(db, "shippingCost");
        let fetchedTaxRate = await getSetting(db, "taxRate");

        if (fetchedShippingCost === null) {
          fetchedShippingCost = SHIPPING_COST;
          await putSetting(db, "shippingCost", SHIPPING_COST);
        }
        setShippingCost(fetchedShippingCost);

        if (fetchedTaxRate === null) {
          fetchedTaxRate = TAX_RATE;
          await putSetting(db, "taxRate", TAX_RATE);
        }
        setTaxRate(fetchedTaxRate);
      } catch (error) {
        console.error("IndexedDB error:", error);
      }
    };

    fetchSettings();
  }, []);

  const addOrder = async (values) => {
    try {
      const order = {
        cardInfo: values,
        cart: cart.map(product => ({
          productId: product.id,
          quantity: product.quantity
        })).filter(item => item.quantity > 0),
        subTotal,
        shippingCost,
        taxRate,
        cardType,
        total: Math.round(subTotal * (1 + taxRate) + shippingCost)
      };

      const db = await openIndexedDB("AppDatabase", 1);
      const transaction = db.transaction("orders", "readwrite");
      const store = transaction.objectStore("orders");
      store.add(order);

    } catch (error) {
      console.error("Error adding order to IndexedDB:", error);
    }
  };

  if (shippingCost === null || taxRate === null) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={{name: '', cardNumber: '', date: '', cvv: ''}}
      validationSchema={cardValidationSchema}
      onSubmit={async (values, {resetForm}) => {
        await addOrder(values);
        resetForm();
      }}
    >
      {({isValid, dirty}) => (
        <Form>
          <div className="text-field card__name">
            <p className="text-small">Name on card</p>
            <Field name="name" type="text" placeholder="Name"/>
            <ErrorMessage name="name" className="error-message" component="p"/>
          </div>
          <div className="text-field card__number">
            <p className="text-small">Card Number</p>
            <Field name="cardNumber">
              {({field}) => (
                <InputMask
                  {...field}
                  mask="____ ____ ____ ____"
                  replacement={{_: /\d/}}
                  type="text"
                  placeholder="1111 2222 3333 4444"
                />
              )}
            </Field>
            <ErrorMessage name="cardNumber" className="error-message" component="p"/>
          </div>
          <div className="card__additional-data">
            <div className="text-field card__exp-date">
              <p className="text-small">Expiration date</p>
              <Field name="date">
                {({field}) => (
                  <InputMask
                    {...field}
                    mask="__/__"
                    replacement={{_: /\d/}}
                    type="text"
                    placeholder="MM/YY"
                  />
                )}
              </Field>
              <ErrorMessage name="date" className="error-message" component="p"/>
            </div>
            <div className="text-field card__secure-code">
              <p className="text-small">CVV</p>
              <Field name="cvv">
                {({field}) => (
                  <InputMask
                    {...field}
                    mask="___"
                    replacement={{_: /\d/}}
                    type="text"
                    placeholder="123"
                  />
                )}
              </Field>
              <ErrorMessage name="cvv" className="error-message" component="p"/>
            </div>
          </div>
          <div className="divider"></div>
          <div className="prices">
            <div className="subtotal space-between">
              <p className="text-small">Subtotal</p>
              <p className="text-small">${subTotal}</p>
            </div>
            <div className="shipping space-between">
              <p className="text-small">Shipping</p>
              <p className="text-small">${shippingCost}</p>
            </div>
            <div className="total space-between">
              <p className="text-small">Total (Tax: {taxRate * 100}%)</p>
              <p className="text-small">${Math.round(subTotal * (1 + taxRate) + shippingCost)}</p>
            </div>
          </div>
          <button
            className={`card__checkout space-between ${!(isValid && dirty) ? 'disabled' : ''}`}
            type="submit"
            disabled={!(isValid && dirty)}
          >
            <p className="body">${Math.round(subTotal * (1 + taxRate) + shippingCost)}</p>
            <p className="body">Checkout</p>
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CardForm;
