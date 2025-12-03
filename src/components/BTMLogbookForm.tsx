import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Plane, Users, Calendar, Clock, MapPin, Tag, CloudCog } from "lucide-react";
import { useNavigate } from "react-router-dom";


import CurrencyToggle from "./CurrencyToggle";
import { useCurrency } from "@/hooks/CurrencyContext";
import { api } from "@/lib/api";
import {
  primaryServices,
  additionalServices,
  referralSources,
  domesticCities,
  internationalCities,
} from "@/lib/data";
import ReusableHeader from "./ReusableHeader";


export const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Please include country code").max(20),

    // services: z.array(z.string()).min(1, "Please select at least one service"),
    services: z.array(z.string()).optional(),


    flightDate: z.string().min(1, "Flight date is required"),
    flightTime: z.string().min(1, "Flight time is required"),
    flightNumber: z
      .string()
      .min(1, "Airline & flight number is required")
      .max(50),
    arrivalCity: z.string().min(1, "Arrival city is required"),
    arrivalCityCustom: z.string().optional(),
    passengers: z.string().min(1, "Number of passengers is required"),

    specialRequests: z.string().optional(),
    discountCode: z.string().optional(),
    referralSource: z.string().optional(),

    // ✅ Return Airport Service section
    returnService: z.boolean().optional(),
    returnDate: z.string().optional(),
    returnFlight: z.string().optional(),
    returnNotes: z.string().optional(),

    // ✅ Pricing
    totalPrice: z.number().min(0, "Total price is required"),
    totalDollarPrice: z.number().optional(),

    // ✅ Include details of selected services
    selectedServicesDetails: z
      .array(
        z.object({
          id: z.string(),
          label: z.string(),
          price: z.number().optional(),
          dollar: z.number().optional(),
        })
      )
      .optional(),
  })

  .refine(
    (data) => {
      if (data.returnService && !data.returnDate) {
        return false;
      }
      return true;
    },
    {
      message: "Return date is required if return service is selected",
      path: ["returnDate"],
    }
  )
  .refine(
    (data) =>
      data.arrivalCity !== "Other" || (data.arrivalCity === "Other" && data.arrivalCityCustom?.trim() !== ""),
    { path: ["arrivalCityCustom"], message: "Please enter arrival city" }
  );



type FormData = z.infer<typeof formSchema>;

  const parsePriceRange = (range: string) => {
    // Remove ₦ and commas, split by "-"
    const parts = range.split("-").map(p => parseInt(p.replace(/[₦,]/g, "").trim(), 10));
    if (parts.length === 1) return [parts[0], parts[0]];
    return parts as [number, number];
  };


export function BookingForm({ type }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDollarPrice, setTotalDollarPrice] = useState(0);
  const { currency, toggleCurrency, format, convert } = useCurrency();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null); 

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

const formatUSD = (amount: number) => `$${convert(amount, "NGN", "USD").toFixed(0)}`;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      services: [],
      flightDate: "",
      flightTime: "",
      flightNumber: "",
      arrivalCity: "",
      passengers: "",
      specialRequests: "",
      discountCode: "",
      referralSource: "",
      returnService: false,
      returnDate: "",
      returnFlight: "",
      returnNotes: "",
      totalPrice: 0,
      totalDollarPrice: 0,
      selectedServicesDetails: [],
    },
  });

  const selectedServices = form.watch("services");

  const arrivalCities =
    type === "domestic" ? domesticCities : internationalCities;

    

    const returnService = form.watch("returnService");

      useEffect(() => {
        const totalNGN =
          selectedServices?.reduce((acc, serviceId) => {
            const svc = primaryServices.find((s) => s.id === serviceId);
            const selectedKey = selectedOptions?.[serviceId];
            return acc + (svc?.prices?.[selectedKey] || 0);
          }, 0) || 0;

        const totalUSD = convert(totalNGN, "NGN", "USD");

        const discountFactor =
          discount?.percentage
            ? 1 - discount.percentage / 100
            : 1;
            
        const discountedNGN = totalNGN * discountFactor;

        const discountedUSD = totalUSD * discountFactor;
        setTotalPrice(discountedNGN);
        setTotalDollarPrice(discountedUSD);

        form.setValue("totalPrice", discountedNGN);
        form.setValue("totalDollarPrice", discountedUSD);
      }, [selectedServices, selectedOptions, returnService, discount]);


    const verifyDiscount = async () => {

     setIsVerifying(true);

      const code = form.getValues("discountCode");

      if (!code) {
        toast.error("Please enter a discount code");
        return;
      }

      try {
        const response = await api.submitCustomerDetails({ code }, "discount");

        if (response.success) {
          setDiscount({
            code: response.code,
            percentage: response.percentage
          });

          toast.success(`Discount applied: ${response.percentage}%`);
        } else {
          setDiscount(null);
          toast.error(response.message || "Invalid discount");
        }
      } catch (error) {
        setDiscount(null);
        toast.error("Server error verifying discount");
      }  finally {
       
    setIsVerifying(false);

      }
    };

   const onSubmit = async (data: FormData) => {
  
    const finalArrivalCity = data.arrivalCity === "Other" ? data.arrivalCityCustom : data.arrivalCity;
  
      try {
        setIsSubmitting(true);

        // -----------------------
        // Prepare selected primary services
        // -----------------------
        // const selectedPrimary = primaryServices
        //   .filter((service) => data.services.includes(service.id))
        //   .map((svc) => ({
        //     ...svc,
        //     selectedFlight: selectedOptions[svc.id],
        //     price: svc.prices?.[selectedOptions[svc.id]] || 0,
            
        //   }));

        // Additional services (not included in total)
        // const selectedAdditional = additionalServices
        //   .filter((service) => data.services.includes(service.id))
        //   .map((svc) => ({ ...svc, price: svc.price || 0 }));

 const selectedPrimary = primaryServices
      .filter(svc => data.services.includes(svc.id))
      .map(svc => ({
        ...svc,
        selectedFlight: selectedOptions[svc.id],
        price: svc.prices?.[selectedOptions[svc.id]] || 0,
        dollar: currency === "USD" ? +convert(svc.prices?.[selectedOptions[svc.id]] || 0, "NGN", "USD").toFixed(2) : undefined
      }));

    // Additional/offline services
    const selectedAdditional = additionalServices
      .filter(svc => data.services.includes(svc.id))
      .map(svc => {
        if (svc.options) {
          const convertedOptions = svc.options.map(opt => {
            const [min, max] = parsePriceRange(opt.priceRange);
            const usdRange = `${formatUSD(min)} - ${formatUSD(max)}`;
            return {
              ...opt,
              priceRangeUSD: usdRange
            };
          });
          return { ...svc, options: convertedOptions };
        }
        // Services without options
        return { ...svc };
      });

        const selectedDetails = [...selectedPrimary, ...selectedAdditional];

        // -----------------------
        // ✅ Use discounted total from state
        // -----------------------
        const payload = {
          ...data,
          arrivalCity:finalArrivalCity,
          selectedServicesDetails: selectedDetails,
          type,
          currency,
          totalPrice: totalPrice.toFixed(2),           
          totalDollarPrice: totalDollarPrice.toFixed(2), 
          discountCode: discount?.code || null,      
        };
        // -----------------------
        // Send to backend
        // -----------------------
        const response = await api.submitCustomerDetails(payload, "booking");

        const requiresPayment =
         Number(response.totalPrice) === 0 || Number(response.totalDollarPrice) === 0;


        // 🚫 INTERNATIONAL → No payment needed
        if (requiresPayment) {
          toast.success("Booking submitted successfully");
          form.reset();
          return;
        }


        if (response.url && response.reference) {
          const amountToPay =
            currency === "USD"
              ? Math.round(response.totalDollarPrice * 100)
              : Math.round(response.totalPrice * 100);

          const handler = (window as any).PaystackPop?.setup({
            key: import.meta.env.VITE_PUBLIC_PAYSTACK_KEY,
            email: response.email,
            amount: amountToPay,
            currency,
            ref: response.reference,
            callback: function (res: any) {
              navigate(`/payment/success?reference=${res.reference}`);
            },
            onClose: function () {
              toast.error("Payment was not completed.");
              navigate(`/payment/failed?reference=${response.reference}`);
            },
          });

          handler.openIframe();
          return;
        }

        toast.error("Booking request failed", {
          description: response?.error || "Payment initialization failed.",
        });
      } catch (error: any) {
        toast.error("Failed to submit booking request", {
          description: error.response?.data?.message || error.message,
        });
      } finally {
        setIsSubmitting(false);
      }
    };



  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
      <ReusableHeader
        title="Airport Services"
        description={
          type === "domestic"
            ? "At BTM Travel, we redefine the airport experience with distinction, comfort, and sophistication. From seamless airport transfers and executive car hire to personalised assistance, lounge access, and meet & greet services — every detail is tailored to complement your journey. Simply complete the form below with your travel details, and our team will curate a bespoke experience that ensures efficiency, ease, and exclusivity from start to finish."
            : "This is for international airports around the world outside Nigeria"
        }
      />

        {type === "domestic" && (
          <div
            className="mb-8 p-4 border border-gray-300 rounded-lg text-center"
            style={{ background: "var(--metal-gradient)" }}
          >
            <p className="font-bold text-xl text-black">
              NOTE: This booking process is for{" "}
              <span style={{ color: "var(--brand-color)" }}>
                Airports in Nigeria only.
              </span>
            </p>
            <p className="mt-2  font-bold text-gray-900">
              For any airport protocol booking outside Nigeria,{" "}
              <a
                href="/international"
                style={{ color: "var(--brand-color)", textDecoration: "none" }}
                className="font-semibold hover:opacity-80 transition-opacity"
              >
                Click Here
              </a>
              .
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (r)=>{
            // console.log("r", r)
          })} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name as on the passport*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Name as on the passport"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Phone Number (Include country code) *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Flight Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar  className="h-5 w-5 text-primary" />
                Flight Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="flightDate"

                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} 
                         min={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flightTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Flight Time *
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="flightNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Airline & Flight Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BA123, UA456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            
            


                {/* Arrival City (Nigeria only) */}
                <FormField
                  control={form.control}
                  name="arrivalCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival City</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val !== "Other") {
                            form.setValue("arrivalCityCustom", "");
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select arrival city" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent 
                         style={{ backgroundColor: "hsl(0 0% 100%)" }}
                        className="text-black border border-border shadow-lg rounded-md max-h-60 overflow-y-auto">
                          {arrivalCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {field.value === "Other" && (
                        <div className="mt-2">
                          <Input
                            placeholder="Enter arrival city"
                            value={form.watch("arrivalCityCustom") || ""}
                            onChange={(e) => form.setValue("arrivalCityCustom", e.target.value)}
                          />
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />


                  <FormField
                    control={form.control}
                    name="passengers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Passengers *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
              </div>
            </div>
            {(type === "domestic" || type === "international") && (
              <>
                {/* 🧾 Additional Info Section */}

                {type === "domestic" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      Additional Information
                    </h3>

                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests or Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requirements or additional information..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      

              <FormField
                control={form.control}
                name="discountCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Discount Code
                    </FormLabel>

                    <div className="flex gap-2 items-center">
                      {/* Input */}
                      <Input
                        placeholder="Enter discount code"
                        {...field}
                      />

                   {field.value?.trim()?.length > 0 && !discount?.percentage && (
                      <button
                        type="button"
                        onClick={verifyDiscount}
                        disabled={isVerifying}
                        className={`
                          px-5 py-2 
                          bg-gradient-to-r from-orange-500 to-yellow-400 
                          text-white font-semibold 
                          rounded-full shadow-lg 
                          hover:from-orange-600 hover:to-yellow-500 
                          transition-all duration-300
                          ${isVerifying ? "opacity-70 cursor-not-allowed" : ""}
                        `}
                      >
                        {isVerifying ? "Verifying..." : "Apply"}
                      </button>
                    )}

                    </div>

                  {discount?.percentage && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center justify-center w-5 h-5 bg-[#ffa30f]/20 text-[#ffa30f] rounded-full animate-pulse">
                        ✔
                      </span>
                      <p className="text-[#ffa30f] text-sm font-medium">
                        Discount applied: {discount.percentage}% off
                      </p>
                    </div>
                  )}



                    <FormMessage />
                  </FormItem>
                )}
              />



                      <FormField
                        control={form.control}
                        name="referralSource"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How did you hear about us?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                style={{ backgroundColor: "hsl(0 0% 100%)" }}
                                className="text-black border border-border shadow-lg rounded-md max-h-60 overflow-y-auto"
                              >
                                {referralSources.map((source) => (
                                  <SelectItem
                                    key={source}
                                    value={source
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}
                                  >
                                    {source}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* ✈️ Return Service (ONLY for International Type) */}
                {/* {type === "international" && (
                  <div className="mt-6 border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold text-primary">
                      Return Airport Service
                    </h3>

                    <FormField
                      control={form.control}
                      name="returnService"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-3 mt-2">
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                id="return-service"
                              />
                              <label
                                htmlFor="return-service"
                                className="text-gray-700"
                              >
                                I would like to book my return airport service
                                (10% discount)
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("returnService") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnFlight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Flight Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. BA123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnNotes"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Additional Notes (optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Add any special requests or return details..."
                                  className="min-h-[80px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )} */}

                {/* 💼 Type of Service */}

                {
                  (type === "domestic" || type === "international" ) && (

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      Type of Service
                    </h3>

                   { type === "domestic" && (

                     <CurrencyToggle />
                   )

                   } 
                  </div>
                  {/* ✅ Primary Services */}
                       { type === "domestic" && (

                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {primaryServices.map((service) => {
                            const isSelected = selectedServices?.includes(service.id);
                            const selectedOpt = selectedOptions?.[service.id];
                            const currentPrice = service.prices?.[type] || 0;
                            const usdValue = convert(currentPrice, "NGN", "USD");

                            // ✅ Lock other services if one service is selected
                            const isLocked = selectedServices?.length > 0 && !isSelected;

                            return (
                              <FormField
                                key={service.id}
                                control={form.control}
                                name="services"
                                render={({ field }) => (
                                  <div
                                    className={`relative border rounded-xl p-4 transition-all overflow-hidden ${
                                      isSelected
                                        ? "border-primary bg-gray-50 shadow-md cursor-pointer"
                                        : isLocked
                                        ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                                        : "border-gray-300 hover:border-primary/50 hover:shadow-sm cursor-pointer"
                                    }`}
                                    style={{
                                      transition: "max-height 0.3s ease, background-color 0.3s ease",
                                      maxHeight: isSelected ? "400px" : "100px",
                                    }}
                                    onClick={(e) => {
                                      if (isLocked) return; // lock click if not selected and another is selected
                                      if ((e.target as HTMLElement).closest(".option-item")) return;

                                      if (isSelected) {
                                        field.onChange(field.value?.filter((id: string) => id !== service.id));
                                        setSelectedOptions((prev) => {
                                          const copy = { ...prev };
                                          delete copy[service.id];
                                          return copy;
                                        });
                                      } else {
                                        field.onChange([...(field.value || []), service.id]);
                                      }
                                    }}
                                  >
                                    {isSelected && (
                                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                                        ✓
                                      </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                      <h4 className={`font-medium ${isSelected ? "text-gray-800" : "text-gray-400"}`}>
                                        {service.label}
                                      </h4>
                                    </div>

                                    {isSelected && (
                                      <div className="mt-3 space-y-2">
                                        {/* Domestic Option */}
                                        <div
                                          className={`option-item flex justify-between items-center p-2 rounded-lg border cursor-pointer transition-all ${
                                            selectedOpt === "domestic"
                                              ? "border-primary bg-primary/10 text-primary font-semibold"
                                              : "border-gray-300 hover:bg-gray-50"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedOptions((prev) => ({
                                              ...prev,
                                              [service.id]: "domestic",
                                            }));
                                          }}
                                        >
                                          <span>Domestic Flight</span>
                                          <span className="text-sm">
                                            {currency === "NGN"
                                              ? `₦${service.prices.domestic.toLocaleString()}`
                                              : `$${convert(service.prices.domestic, "NGN", "USD").toFixed(2)}`}
                                          </span>
                                        </div>

                                        {/* International Option */}
                                        <div
                                          className={`option-item flex justify-between items-center p-2 rounded-lg border cursor-pointer transition-all ${
                                            selectedOpt === "international"
                                              ? "border-primary bg-primary/10 text-primary font-semibold"
                                              : "border-gray-300 hover:bg-gray-50"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedOptions((prev) => ({
                                              ...prev,
                                              [service.id]: "international",
                                            }));
                                          }}
                                        >
                                          <span>International Flight</span>
                                          <span className="text-sm">
                                            {currency === "NGN"
                                              ? `₦${service.prices.international.toLocaleString()}`
                                              : `$${convert(service.prices.international, "NGN", "USD").toFixed(2)}`}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              />
                            );
                          })}
                        </div>
                          )

                          } 
              


                  {/* ✅ Additional Services */}
                  <FormDescription className="mt-6 text-xl font-semibold text-pretty">
                    I would also like BTM to arrange the following for me.
                  </FormDescription>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {additionalServices.map((service) => {
                      const isSelected = selectedServices?.includes(service.id);
                      const selectedOpt = selectedOptions?.[service.id];

                       const isLocked =
                      (service.id === "car-hire" && selectedServices?.includes("airport-transfer")) ||
                      (service.id === "airport-transfer" && selectedServices?.includes("car-hire"));


                      return (
                     <FormField
        key={service.id}
        control={form.control}
        name="services"
        render={({ field }) => (
          <div
            className={`relative border rounded-xl p-4 cursor-pointer transition-all overflow-hidden ${
              isSelected
                ? "border-primary bg-gray-50 shadow-md"
                : isLocked
                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                : "border-gray-300 hover:border-primary/50 hover:shadow-sm"
            }`}
            style={{
              transition: "max-height 0.3s ease, background-color 0.3s ease",
              maxHeight: isSelected ? "400px" : "110px",
            }}
            onClick={(e) => {
              if (isLocked) return; // 🚫 prevent click if locked

              if ((e.target as HTMLElement).closest(".option-item")) return;

              if (isSelected) {
                field.onChange(
                  field.value?.filter((id: string) => id !== service.id)
                );
                setSelectedOptions((prev) => {
                  const copy = { ...prev };
                  delete copy[service.id];
                  return copy;
                });
              } else {
                field.onChange([...(field.value || []), service.id]);
              }
            }}
          >
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                                  ✓
                                </div>
                              )}

                              {/* Header */}
                              <div className="flex justify-between items-center">
                                <h4
                                  className={`font-medium ${
                                    isSelected
                                      ? "text-gray-800"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {service.label}
                                </h4>

                                {/* 💰 Price handling */}
                                {/* 💰 Price handling */}
                                {/* {type === "domestic" && !service.options && service.price && (
                                  <span className="font-bold text-primary text-sm">
                                    {service.price
                                      ? currency === "NGN"
                                        ? format(service.price, "NGN")
                                        : format(
                                            convert(
                                              service.price,
                                              "NGN",
                                              "USD"
                                            ),
                                            "USD"
                                          )
                                      : "Contact BTM"}
                                  </span>
                                )} */}
                                {type === "domestic" && !service.options && (
                              <span className="font-bold text-primary text-sm">
                                {service.price === 0 ? (
                                  <>
                                   {""}
                                  </>
                                ) : currency === "NGN" ? (
                                  format(service.price, "NGN")
                                ) : (
                                  format(convert(service.price, "NGN", "USD"), "USD")
                                )}
                              </span>
                            )}

                              </div>

                              {/* 🚗 Nested Options (SUV, Bus, etc.) */}
                              {/* {isSelected && service.options && ( */}
                              {isSelected && service.options && type === "domestic" && (
                                <div className="mt-3 space-y-2">
                                  {service.options.map((opt) => {
                                    const isOptSelected =
                                      selectedOpt === opt.type;

                                    // ✨ Handle both pre-defined USD ranges & converted NGN ranges
                                    const displayRange =
                                      currency === "NGN"
                                        ? opt.priceRange
                                        : // if there's no predefined USD range, calculate
                                          (() => {
                                            const matches =
                                              opt.priceRange.match(
                                                /₦?([\d,]+)(?:\s*-\s*₦?([\d,]+))?/
                                              );
                                            if (!matches) return "";
                                            const [_, min, max] = matches;
                                            const minNum = parseFloat(
                                              min.replace(/,/g, "")
                                            );
                                            const maxNum = max
                                              ? parseFloat(
                                                  max.replace(/,/g, "")
                                                )
                                              : minNum;

                                            const minUSD = convert(
                                              minNum,
                                              "NGN",
                                              "USD"
                                            );
                                            const maxUSD = convert(
                                              maxNum,
                                              "NGN",
                                              "USD"
                                            );

                                            return `$${minUSD.toFixed(0)}${
                                              max
                                                ? ` - $${maxUSD.toFixed(0)}`
                                                : ""
                                            }`;
                                          })();

                                    return (
                                      <div
                                        key={opt.type}
                                        className={`option-item flex justify-between items-center p-2 rounded-lg border cursor-pointer transition-all ${
                                          isOptSelected
                                            ? "border-primary bg-primary/10 text-primary font-semibold"
                                            : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOptions((prev) => ({
                                            ...prev,
                                            [service.id]:
                                              prev[service.id] === opt.type
                                                ? ""
                                                : opt.type,
                                          }));
                                        }}
                                      >
                                        <span>{opt.type}</span>
                                        <span className="text-sm">
                                          {displayRange}
                                        </span>
                                      </div>
                                    );
                                  })}
                        {isSelected && (
                          <div className="mt-3 text-sm text-gray-500">
                            {/* Custom notes per service */}
                            {service.id === "lounge-services" && (
                              <span className="font-bold text-sm">
                                (International Lounge Access is not available upon arrival at Terminal 2, MMA1).
                              </span>
                            )}{" "}
                            
                            These services are available <strong>within Lagos only.</strong>
                            <br />{service.id === "car-hire" && (
                              <span className="font-bold text-sm">
                                for the full day.
                              </span>
                            )}
                            {service.id === "airport-transfer" && (
                              <span className="font-bold text-sm">
                                Pickup Location: International car park.
                              </span>
                            )}
                            {" "}
                            For services outside Lagos, please contact{" "}
                            <a
                              href="tel:+2348129911921"
                              className="text-primary font-medium hover:underline"
                            >
                              +234 812 991 1921
                            </a>.
                          </div>
                        )}


                                </div>
                              )}
                            </div>
                          )}
                        />
                      );
                    })}
                  </div>
                  {/* 🧾 Offline Payment Summary (Additional Services) */}
                  {selectedServices?.some((id: string) =>
                    additionalServices.some((s) => s.id === id)
                  ) && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Offline Payment Summary
                      </h4>

                      <ul className="space-y-2">
                        {selectedServices.map((id: string) => {
                          const svc = additionalServices.find(
                            (s) => s.id === id
                          );
                          if (!svc) return null;
                          const opt = selectedOptions?.[id];

                          return (
                            <li
                              key={id}
                              className="flex justify-between text-gray-700"
                            >
                              <div className="flex flex-col">
                                <span>
                                  {svc.label}
                                  {opt ? ` - ${opt}` : ""}
                                </span>

                                {/* ✅ Correctly convert Naira to USD */}
                                {svc.options ? (
                                  <span className="text-xs text-gray-500">
                                    {(() => {
                                      const selectedOption = svc.options.find(
                                        (o) => o.type === opt
                                      );
                                      if (!selectedOption) return "";

                                      const rangeText =
                                        selectedOption.priceRange;
                                      const numbers = rangeText
                                        .replace(/₦|,/g, "")
                                        .split(" - ")
                                        .map((p) => parseFloat(p.trim()));

                                      const converted = numbers.map((val) =>
                                        currency === "NGN"
                                          ? `₦${val.toLocaleString()}`
                                          : `$${convert(
                                              val,
                                              "NGN",
                                              "USD"
                                            ).toFixed(2)}`
                                      );

                                      return converted.join(" - ");
                                    })()}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    {svc.price
                                      ? currency === "NGN"
                                        ? `₦${svc.price.toLocaleString()}`
                                        : `$${convert(
                                            svc.price,
                                            "NGN",
                                            "USD"
                                          ).toFixed(2)}` 
                                      :  <>
                                    Contact BTM or Book directly on {" "}
                                    <a
                                      href="https://btmtravel.net/tours"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-primary font-extrabold"
                                      style={{ color: "var(--brand-color)", textDecoration: "none" }}
                                    >
                                      Tours
                                    </a>
                                  </>}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                     <div className="mt-4 text-sm text-gray-600 border-t pt-3 leading-relaxed">
                      <p>
                        <strong>Note:</strong> Payment for these services is made <strong>offline</strong>. 
                        Please contact a BTM representative at <a href="tel:+2348129911921" className="text-primary font-bold hover:underline">+234&nbsp;812&nbsp;991&nbsp;1921</a> 
                          {""} to confirm and arrange your payment.
                      </p>
                    </div>

                    </div>
                  )}

                  {/* 🧮 Cart Summary (Primary Only) */}
                  {selectedServices?.some((id: string) =>
                    primaryServices.some((s) => s.id === id)
                  ) && (
                 <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    Cart Summary
                    {discount?.percentage && (
                      <span className="text-sm font-medium text-[#ffa30f]">
                        ✔ Discount applied: {discount.percentage}% off
                      </span>
                    )}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {currency === "NGN"
                          ? `₦${totalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : `$${totalDollarPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2 border-t pt-2">
                      <span className="font-semibold text-gray-700">Total</span>
                      <span className="text-lg font-bold text-primary">
                        {currency === "NGN"
                          ? `₦${totalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : `$${totalDollarPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                      </span>
                    </div>
                  </div>
                </div>

                  )}
                </div>
                  )
                }


              </>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
