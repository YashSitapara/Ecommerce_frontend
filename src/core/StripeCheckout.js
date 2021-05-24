import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';

import StripeCheckoutButton from "react-stripe-checkout";


const StripeCheckout = ({ products, setReload = f => f , reload= undefined }) => {

    const [data, setData] = useState({
        loading: false,
        success: false,
        errror: "",
        address: ""
    });

    const tokenu = isAuthenticated() && isAuthenticated().token;
    const userId = isAuthenticated() && isAuthenticated().user._id;

    const getFinalAmount = () => {
        let amount = 0;
        products.map(p => {
            amount = amount + p.price;
        });
        return amount;
    };

    const makePayment = token => {
        const body = {
            token,
            products
        };
        console.log("TOKEN ",token);

        const headers = {
            "Content-Type": "application/json"
        };
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log("RESPONSE ",response);
            const { status } = response;
            console.log("STATUS ", status);
            
            const orderData = {
                products: products,
                address: token.card.address_line1+','+token.card.address_city+','+token.card.address_country+','+token.card.address_zip,
                transaction_id: response.id,
                amount: response.amount
            }

            createOrder(userId, tokenu, orderData);
            // Empty the cart
            cartEmpty(() => {
                console.log("Did we got a crash.")
            });
            // force reload
            setReload(!reload);

        }).catch(error => console.log(error))
    };

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                stripeKey={process.env.REACT_APP_STRIPE_FRONTEND}
                token={makePayment}
                amount={getFinalAmount() * 100}
                name="Buy Tshirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with Stripe</button>
            </StripeCheckoutButton>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Signin</button>
            </Link>
        );
    };

    return (
        <div>
            <h3 className="text-white">Stripe checkout {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    )
}

export default StripeCheckout;