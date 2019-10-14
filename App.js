import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/order";
import ShopNavigator from "./navigation/ShopNavigation";

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  order: ordersReducer
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
