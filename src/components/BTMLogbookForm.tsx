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
import { Plane, Users, Calendar, Clock, MapPin, Tag } from "lucide-react";
import axios from "axios";

import { Link } from "react-router-dom";
import CurrencyToggle from "./CurrencyToggle";
import { useCurrency } from "@/hooks/CurrencyContext";
import { api } from "@/lib/api";
import {
  primaryServices,
  additionalServices,
  referralSources,
  departureCities,
  domesticCities,
  internationalCities,
} from "@/lib/data";

// export const formSchema = z.object({
//   fullName: z
//     .string()
//     .min(2, "Full name must be at least 2 characters")
//     .max(100),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(8, "Please include country code").max(20),

//   services: z.array(z.string()).min(1, "Please select at least one service"),

//   flightDate: z.string().min(1, "Flight date is required"),
//   flightTime: z.string().min(1, "Flight time is required"),
//   flightNumber: z
//     .string()
//     .min(1, "Airline & flight number is required")
//     .max(50),
//   departureCity: z.string().min(1, "Departure city is required"),
//   arrivalCity: z.string().min(1, "Arrival city is required"),
//   passengers: z.string().min(1, "Number of passengers is required"),
//   specialRequests: z.string().optional(),
//   discountCode: z.string().optional(),
//   referralSource: z.string().optional(),

//   // 🆕 Add total price for submission
//   totalPrice: z.number().min(0, "Total price is required"),

//   // 🆕 Optional: include details of services selected
//   selectedServicesDetails: z
//     .array(
//       z.object({
//         id: z.string(),
//         label: z.string(),
//         price: z.number(),
//       })
//     )
//     .optional(),
// });

export const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Please include country code").max(20),

    services: z.array(z.string()).min(1, "Please select at least one service"),

    flightDate: z.string().min(1, "Flight date is required"),
    flightTime: z.string().min(1, "Flight time is required"),
    flightNumber: z
      .string()
      .min(1, "Airline & flight number is required")
      .max(50),
    departureCity: z.string().min(1, "Departure city is required"),
    arrivalCity: z.string().min(1, "Arrival city is required"),
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
  // ✅ Object-level refinement for conditional validation
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
  );

type FormData = z.infer<typeof formSchema>;

// const services = [
//   {
//     id: "standard-meet-greet",
//     label: "Standard Meet and Greet",
//     price: 20000,
//     dollar: 20,
//   },
//   {
//     id: "vip-meet-greet",
//     label: "VIP Meet and Greet",
//     price: 35000,
//     dollar: 40,
//   },
//   { id: "car-hire", label: "Car Hire", price: 30000, dollar: 20 }, // Add real price if needed
//   {
//     id: "airport-transfer",
//     label: "Airport Transfer",
//     price: 30000,
//     dollar: 20,
//   },
//   { id: "lounge-services", label: "Lounge Services", price: 40000, dollar: 20 },
//   {
//     id: "escort-services",
//     label: "Security Escort Vehicle",
//     price: 30000,
//     dollar: 20,
//   },
// ];

export function BookingForm({ type }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDollarPrice, setTotalDollarPrice] = useState(0);
  const { currency, toggleCurrency, format, convert } = useCurrency();

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  // const form = useForm<FormData>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     fullName: "",
  //     email: "",
  //     phone: "",
  //     services: [],
  //     flightDate: "",
  //     flightTime: "",
  //     flightNumber: "",
  //     departureCity: "",
  //     arrivalCity: "",
  //     passengers: "",
  //     specialRequests: "",
  //     discountCode: "",
  //     referralSource: "",
  //     totalPrice: 0,
  //     selectedServicesDetails: [],
  //   },
  // });
  // const selectedServices = form.watch("services");

  // Choose cities based on type
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
      departureCity: "",
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

  // useEffect(() => {
  //   const total = selectedServices?.reduce((acc, serviceId) => {
  //     const svc = services.find((s) => s.id === serviceId);
  //     return acc + (svc?.price || 0);
  //   }, 0);
  //   setTotalPrice(total);
  // }, [selectedServices]);
  useEffect(() => {
    // Calculate total for selected primary services
    const totalNGN =
      selectedServices?.reduce((acc, serviceId) => {
        const svc = primaryServices.find((s) => s.id === serviceId);
        return acc + (svc?.price || 0);
      }, 0) || 0;

    const totalUSD =
      selectedServices?.reduce((acc, serviceId) => {
        const svc = primaryServices.find((s) => s.id === serviceId);
        return acc + (svc?.dollar || 0);
      }, 0) || 0;

    // ✅ Apply 10% discount if return airport service selected
    const isReturnService = form.watch("returnService");
    const discountFactor = isReturnService ? 0.9 : 1; // 10% off

    const discountedNGN = totalNGN * discountFactor;
    const discountedUSD = totalUSD * discountFactor;

    setTotalPrice(discountedNGN);
    setTotalDollarPrice(discountedUSD);

    // ✅ Sync with form state
    form.setValue("totalPrice", discountedNGN);
    form.setValue("totalDollarPrice", discountedUSD);
  }, [selectedServices, form.watch("returnService")]);

  // useEffect(() => {
  //   // Only include primary services in total calculation
  //   const totalNGN =
  //     selectedServices?.reduce((acc, serviceId) => {
  //       const svc = primaryServices.find((s) => s.id === serviceId);
  //       return acc + (svc?.price || 0);
  //     }, 0) || 0;

  //   const totalUSD =
  //     selectedServices?.reduce((acc, serviceId) => {
  //       const svc = primaryServices.find((s) => s.id === serviceId);
  //       return acc + (svc?.dollar || 0);
  //     }, 0) || 0;

  //   setTotalPrice(totalNGN);
  //   setTotalDollarPrice(totalUSD);
  // }, [selectedServices]);

  // useEffect(() => {
  //   const totalNGN =
  //     selectedServices?.reduce((acc, serviceId) => {
  //       const svc = services.find((s) => s.id === serviceId);
  //       return acc + (svc?.price || 0);
  //     }, 0) || 0;

  //   const totalUSD =
  //     selectedServices?.reduce((acc, serviceId) => {
  //       const svc = services.find((s) => s.id === serviceId);
  //       return acc + (svc?.dollar || 0);
  //     }, 0) || 0;

  //   setTotalPrice(totalNGN);
  //   setTotalDollarPrice(totalUSD);
  // }, [selectedServices]);

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     setIsSubmitting(true);

  //     // 🧮 Calculate total price based on selected services
  //     const selectedDetails = services.filter((service) =>
  //       data.services.includes(service.id)
  //     );
  //     const totalPrice = selectedDetails.reduce(
  //       (acc, service) => acc + service.price,
  //       0
  //     );

  //     const payload = {
  //       ...data,
  //       totalPrice,
  //       selectedServicesDetails: selectedDetails,
  //     };

  //     const response = await axios.post(
  //       // Use production URL in prod:
  //       // "https://airport-server-onj2.onrender.com/api/booking",
  //       "http://localhost:5000/api/booking",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     toast.success("Booking request submitted successfully!", {
  //       description:
  //         "Our team will contact you shortly to confirm your booking.",
  //     });

  //     form.reset();
  //   } catch (error: any) {
  //     toast.error("Failed to submit booking request", {
  //       description: error.response?.data?.message || error.message,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Separate primary and additional services
      const selectedPrimary = primaryServices.filter((service) =>
        data.services.includes(service.id)
      );

      const selectedAdditional = additionalServices.filter((service) =>
        data.services.includes(service.id)
      );

      // Calculate total price from primary services
      let totalPrice = selectedPrimary.reduce(
        (acc, service) => acc + service.price,
        0
      );

      // ✅ Apply 10% discount if return airport service is selected
      if (data.returnService) {
        totalPrice = totalPrice * 0.9;
      }

      // Combine all selected services for reference
      const selectedDetails = [...selectedPrimary, ...selectedAdditional];

      const payload = {
        ...data,
        totalPrice,
        selectedServicesDetails: selectedDetails,
        type,
      };

      await api.submitCustomerDetails(payload, "booking");

      toast.success("Booking request submitted successfully!", {
        description:
          "Our team will contact you shortly to confirm your booking.",
      });

      form.reset();
    } catch (error: any) {
      toast.error("Failed to submit booking request", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     setIsSubmitting(true);

  //     // Separate primary and additional services
  //     const selectedPrimary = primaryServices.filter((service) =>
  //       data.services.includes(service.id)
  //     );

  //     const selectedAdditional = additionalServices.filter((service) =>
  //       data.services.includes(service.id)
  //     );

  //     // Only calculate total price from primary services
  //     const totalPrice = selectedPrimary.reduce(
  //       (acc, service) => acc + service.price,
  //       0
  //     );

  //     // Combine all selected services for reference
  //     const selectedDetails = [...selectedPrimary, ...selectedAdditional];

  //     const payload = {
  //       ...data,
  //       totalPrice,
  //       selectedServicesDetails: selectedDetails,
  //       type,
  //     };

  //     await api.submitCustomerDetails(data, "booking");

  //     toast.success("Booking request submitted successfully!", {
  //       description:
  //         "Our team will contact you shortly to confirm your booking.",
  //     });

  //     form.reset();
  //   } catch (error: any) {
  //     toast.error("Failed to submit booking request", {
  //       description: error.response?.data?.message || error.message,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     setIsSubmitting(true);

  //     const selectedDetails = services.filter((service) =>
  //       data.services.includes(service.id)
  //     );
  //     const totalPrice = selectedDetails.reduce(
  //       (acc, service) => acc + service.price,
  //       0
  //     );

  //     const payload = {
  //       ...data,
  //       totalPrice,
  //       selectedServicesDetails: selectedDetails,
  //       type,
  //     };

  //     await api.submitCustomerDetails(data, "booking");

  //     // const response = await axios.post(
  //     //   // In production, use your deployed server URL
  //     //   // "https://airport-server-onj2.onrender.com/api/booking",
  //     //   "http://localhost:5000/api/booking",
  //     //   payload,
  //     //   {
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //   }
  //     // );

  //     toast.success("Booking request submitted successfully!", {
  //       description:
  //         "Our team will contact you shortly to confirm your booking.",
  //     });

  //     form.reset();
  //   } catch (error: any) {
  //     toast.error("Failed to submit booking request", {
  //       description: error.response?.data?.message || error.message,
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="relative flex flex-col items-center text-center mb-10 rounded-xl border border-gray-400 bg-gradient-to-b from-white to-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img
              src="/assets/btm.png"
              alt="BTM Logo"
              className="h-14 w-auto drop-shadow-sm"
            />
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                Airport Protocol Services
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                At BTM, we redefine the airport experience with excellence,
                comfort, and class. From swift airport transfers and executive
                car hire to personalized escort, lounge access, and meet & greet
                services — every detail is designed to complement your journey.
                Simply fill out the form below with your travel details, and our
                team will curate a tailored experience that ensures efficiency,
                ease, and exclusivity from start to finish.
              </p>
            </div>
          </div>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent rounded-full"></div>
        </header>
        {type === "domestic" && (
          <div
            className="mb-8 p-4 border border-gray-300 rounded-lg text-center"
            style={{ background: "var(--metal-gradient)" }}
          >
            <p className="font-bold text-black">
              NOTE: This booking process is for{" "}
              <span style={{ color: "var(--brand-color)" }}>
                Domestic Airports in Nigeria only.
              </span>
            </p>
            <p className="mt-2 text-gray-900">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Calendar className="h-5 w-5 text-primary" />
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
                        <Input type="date" {...field} />
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

                <FormField
                  control={form.control}
                  name="departureCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure City *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select or choose 'Other'" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          style={{ backgroundColor: "hsl(0 0% 100%)" }}
                          className="text-black border border-border shadow-lg rounded-md max-h-60 overflow-y-auto"
                        >
                          {departureCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Show custom input if 'Other' selected */}
                      {field.value === "Other" && (
                        <div className="mt-2">
                          <Input
                            placeholder="Enter departure city"
                            onChange={(e) =>
                              form.setValue("departureCity", e.target.value)
                            }
                          />
                        </div>
                      )}
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
                      <FormLabel>Arrival City (Nigeria) *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select arrival city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          style={{ backgroundColor: "hsl(0 0% 100%)" }}
                          className="text-black border border-border shadow-lg rounded-md max-h-60 overflow-y-auto"
                        >
                          {arrivalCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        {/* Show custom input if 'Other' selected */}
                        {field.value === "Other" && (
                          <div className="mt-2">
                            <Input
                              placeholder="Enter departure city"
                              onChange={(e) =>
                                form.setValue("departureCity", e.target.value)
                              }
                            />
                          </div>
                        )}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {type === "domestic" && (
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
                )}
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
                            <FormControl>
                              <Input placeholder="If available" {...field} />
                            </FormControl>
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
                              <SelectContent className="text-black border border-border shadow-lg rounded-md max-h-60 overflow-y-auto">
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
                {type === "international" && (
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
                )}

                {/* 💼 Type of Service */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      Type of Service
                    </h3>
                    <CurrencyToggle />
                  </div>
                  {/* ✅ Primary Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {primaryServices.map((service) => {
                      const isSelected = selectedServices?.includes(service.id);

                      return (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="services"
                          render={({ field }) => (
                            <div
                              className={`relative border rounded-xl p-4 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-gray-50 shadow-md"
                                  : "border-gray-300 hover:border-primary/50 hover:shadow-sm"
                              }`}
                              onClick={() => {
                                if (isSelected) {
                                  field.onChange([]);
                                } else {
                                  field.onChange([service.id]);
                                }
                              }}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                                  ✓
                                </div>
                              )}
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-800">
                                  {service.label}
                                </h4>
                                <span className="font-bold text-primary">
                                  {currency === "NGN"
                                    ? `₦${service.price.toLocaleString()}`
                                    : `$${service.dollar.toLocaleString()}`}
                                </span>
                              </div>
                            </div>
                          )}
                        />
                      );
                    })}
                  </div>
                  {/* ✅ Additional Services */}
                  <FormDescription className="mt-6">
                    I would also like BTM to arrange the following for me.
                  </FormDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {additionalServices.map((service) => {
                      const isSelected = selectedServices?.includes(service.id);
                      const selectedOpt = selectedOptions?.[service.id];

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
                                  : "border-gray-300 hover:border-primary/50 hover:shadow-sm"
                              }`}
                              style={{
                                transition:
                                  "max-height 0.3s ease, background-color 0.3s ease",
                                maxHeight:
                                  isSelected && service.options
                                    ? "500px"
                                    : "100px",
                              }}
                              onClick={(e) => {
                                if (
                                  (e.target as HTMLElement).closest(
                                    ".option-item"
                                  )
                                )
                                  return;

                                if (isSelected) {
                                  field.onChange(
                                    field.value?.filter(
                                      (id: string) => id !== service.id
                                    )
                                  );
                                  setSelectedOptions((prev) => {
                                    const copy = { ...prev };
                                    delete copy[service.id];
                                    return copy;
                                  });
                                } else {
                                  field.onChange([
                                    ...(field.value || []),
                                    service.id,
                                  ]);
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
                                {!service.options && (
                                  <span className="font-bold text-primary text-sm">
                                    {service.price
                                      ? // ✅ Lounge has both, so use correct one
                                        service.dollar
                                        ? currency === "NGN"
                                          ? format(service.price, "NGN")
                                          : format(service.dollar, "USD")
                                        : // ✅ Convert dynamically if USD missing
                                        currency === "NGN"
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
                                )}
                              </div>

                              {/* 🚗 Nested Options (SUV, Bus, etc.) */}
                              {isSelected && service.options && (
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
                                            if (!matches) return "See BTM";
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

                                {/* Dynamically convert Naira to USD for options */}
                                {svc.options ? (
                                  <span className="text-xs text-gray-500">
                                    {currency === "NGN"
                                      ? svc.options.find((o) => o.type === opt)
                                          ?.priceRange || "See BTM"
                                      : (() => {
                                          const selectedOption =
                                            svc.options.find(
                                              (o) => o.type === opt
                                            );
                                          if (!selectedOption) return "See BTM";

                                          const rangeParts =
                                            selectedOption.priceRange
                                              .replace(/₦|,/g, "")
                                              .split(" - ");

                                          const converted = rangeParts
                                            .map((p) => convert(parseFloat(p)))
                                            .join(" - ");

                                          return converted;
                                        })()}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    {svc.price
                                      ? convert(svc.price)
                                      : "Contact BTM"}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="mt-4 text-sm text-gray-600 border-t pt-3 leading-relaxed">
                        <p>
                          <strong>Note:</strong> These services are payable{" "}
                          <b>offline</b>. Our BTM representative will contact
                          you to confirm and arrange payment.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 🧮 Cart Summary (Primary Only) */}
                  {selectedServices?.some((id: string) =>
                    primaryServices.some((s) => s.id === id)
                  ) && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Cart Summary
                      </h4>

                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal</span>
                          <span className="font-semibold">
                            {currency === "NGN"
                              ? `₦${totalPrice.toLocaleString()}`
                              : `$${totalDollarPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}`}
                          </span>
                        </div>

                        {/* 🟢 Discount (Only for International Type) */}
                        {type === "international" &&
                          form.watch("returnService") && (
                            <div className="flex justify-between text-green-600">
                              <span>10% Return Discount</span>
                              <span>
                                -
                                {currency === "NGN"
                                  ? `₦${(totalPrice * 0.1).toLocaleString()}`
                                  : `$${(totalDollarPrice * 0.1).toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: 2,
                                      }
                                    )}`}
                              </span>
                            </div>
                          )}

                        <div className="flex justify-between items-center mt-2 border-t pt-2">
                          <span className="font-semibold text-gray-700">
                            Total
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {type === "international" &&
                            form.watch("returnService")
                              ? currency === "NGN"
                                ? `₦${totalPrice.toLocaleString()}`
                                : `$${totalDollarPrice.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  )}`
                              : currency === "NGN"
                              ? `₦${totalPrice.toLocaleString()}`
                              : `$${totalDollarPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
