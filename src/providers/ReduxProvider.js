"use client";

import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { store } from "@/store/store";
import { AdminProvider } from "@/store/AdminContext";

export default function ReduxProvider({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AdminProvider>
          {children}
        </AdminProvider>
      </Provider>
    </SessionProvider>
  );
}

