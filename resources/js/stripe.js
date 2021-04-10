import axios from "axios";
import Noty from "noty";
import { loadStripe } from "@stripe/stripe-js";

var cardElement = null;

export const initStripe = async () => {
  const orderForm = document.getElementById("order-form");
  const paymentMethod = document.getElementById("paymentMethod");

  if (paymentMethod) {
    // initialize stripe
    const stripe = await loadStripe(
      "pk_test_51HhHwxDTvrhXEQThe4i2exajqIwZZicp1O7YrIVKqwukFLpBJFTs0bXj3b98mLVMvRpeFyLOtVKF24CTOU7zLt3S00gNIJRsOp"
    );

    // show wizard
    paymentMethod.addEventListener("change", (e) => {
      if (e.target.value === "card") {
        // add sripe wiz
        generateCard(stripe);
      } else {
        // remove sripe wiz
        cardElement.destroy("#cardElement");
      }
    });

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(orderForm);

      if (!cardElement) {
        placeOrderAjax(formData);
        return;
      }

      stripe
        .createToken(cardElement)
        .then((res) => {
          formData.append("stripeToken", res.token.id)
          placeOrderAjax(formData)
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
};

const generateCard = (stripe) => {
  var style = {
    base: {
      color: "#303238",
      fontSize: "14px",
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF",
      },
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238",
      },
    },
  };
  var elements = stripe.elements();
  cardElement = elements.create("card", { style, hidePostalCode: true });
  cardElement.mount("#cardElement");
};

const placeOrderAjax = (formData) => {
  axios
    .post("/customer/orders", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      new Noty({
        type: "success",
        text: res.data.message,
        timeout: 2000,
        progressBar: false,
      }).show();

      setTimeout(() => {
        window.location.href = `/customer/order/${res.data.orderId}`;
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      new Noty({
        type: "error",
        text: res.data.error,
        timeout: 2000,
        progressBar: false,
      }).show();
    });
};
