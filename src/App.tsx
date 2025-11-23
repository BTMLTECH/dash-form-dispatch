
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FeedbackForm from "./components/FeedbackForm";
import CustomerDetailsForm from "./components/CustomerDetailsForm";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import { BookingForm } from "./components/BTMLogbookForm";
import { CurrencyProvider } from "./hooks/CurrencyContext";
import AdminPage from "./components/admin/Admin";
import SignupForm from "./components/admin/Signup";
import QRCodePage from "./components/QRCodePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ✅ Wrap entire app in CurrencyProvider */}
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Index key="domestic" type="domestic" />}
            />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/customer-details" element={<CustomerDetailsForm />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
            <Route path="/login" element={<AdminPage />} />
            {/* <Route path="/admin/signup" element={<SignupForm />} /> */}
            <Route path="/qrcode" element={<QRCodePage />} />

            <Route
              path="/international"
              element={<BookingForm key="international" type="international" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
