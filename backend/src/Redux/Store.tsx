import { configureStore } from "@reduxjs/toolkit";
import LanguageReducer from "./LanguageReducer";
import LayoutReducer from "./LayoutReducer";
import AuthReducer from "./Auth"
import DiscountReducer from './discount'
import UserReducer from './User'
import PayOrdReducer from './payment-orders'

const store = configureStore({
  reducer: {
    LayoutReducer: LayoutReducer,
    LangReducer: LanguageReducer,
    AuthReducer: AuthReducer,
    DiscountReducer: DiscountReducer,
    UserReducer: UserReducer,
    PayOrdReducer: PayOrdReducer,
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
