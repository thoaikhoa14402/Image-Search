import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import reportWebVitals from './reportWebVitals';
import Spinner from './Spinner/Spinner';

const client = new QueryClient({
  defaultOptions: { queries: { suspense: true } },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={client}>
    <React.Suspense fallback={<Spinner/>}>
      <App />
    </React.Suspense>
  </QueryClientProvider>
  // </React.StrictMode>
);

reportWebVitals();
