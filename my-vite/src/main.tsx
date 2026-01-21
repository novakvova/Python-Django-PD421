import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import ScrollToTop from "./functional/ScrollToTop.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Provider} from "react-redux";
import {store} from "./store";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <GoogleOAuthProvider
                    clientId={"688315354046-isd3q5qkjaj88uaj9oudrldsf18bm592.apps.googleusercontent.com"}>
                    <ScrollToTop>
                        <App/>
                    </ScrollToTop>
                </GoogleOAuthProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
