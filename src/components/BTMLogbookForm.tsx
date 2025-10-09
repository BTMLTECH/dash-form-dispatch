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

const departureCities = [
  "London",
  "New York",
  "Dubai",
  "Paris",
  "Johannesburg",
  "Other",
];
const domesticCities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Kano",
  "Enugu",
  "Kaduna",
  "Owerri",
  "Benin City",
  "Ibadan",
  "Calabar",
  "Uyo",
  "Other",
];

const internationalCities = ["Lagos", "Abuja", "Port Harcourt", "Kano"];

export const formSchema = z.object({
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

  // 🆕 Add total price for submission
  totalPrice: z.number().min(0, "Total price is required"),

  // 🆕 Optional: include details of services selected
  selectedServicesDetails: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        price: z.number(),
      })
    )
    .optional(),
});
type FormData = z.infer<typeof formSchema>;

const services = [
  {
    id: "standard-meet-greet",
    label: "Standard Meet and Greet",
    price: 20000,
    dollar: 20,
  },
  {
    id: "vip-meet-greet",
    label: "VIP Meet and Greet",
    price: 35000,
    dollar: 40,
  },
  { id: "car-hire", label: "Car Hire", price: 30000, dollar: 20 }, // Add real price if needed
  {
    id: "airport-transfer",
    label: "Airport Transfer",
    price: 30000,
    dollar: 20,
  },
  { id: "lounge-services", label: "Lounge Services", price: 40000, dollar: 20 },
  {
    id: "escort-services",
    label: "Security Escort Vehicle",
    price: 30000,
    dollar: 20,
  },
];

const referralSources = [
  "Google Search",
  "Social Media",
  "Friend/Family Referral",
  "Travel Agency",
  "Previous Customer",
  "Advertisement",
  "Other",
];

export function BookingForm({ type }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDollarPrice, setTotalDollarPrice] = useState(0);
  const { currency, toggleCurrency } = useCurrency();
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
      totalPrice: 0,
      selectedServicesDetails: [],
    },
  });
  const selectedServices = form.watch("services");

  // Choose cities based on type
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
    const totalNGN =
      selectedServices?.reduce((acc, serviceId) => {
        const svc = services.find((s) => s.id === serviceId);
        return acc + (svc?.price || 0);
      }, 0) || 0;

    const totalUSD =
      selectedServices?.reduce((acc, serviceId) => {
        const svc = services.find((s) => s.id === serviceId);
        return acc + (svc?.dollar || 0);
      }, 0) || 0;

    setTotalPrice(totalNGN);
    setTotalDollarPrice(totalUSD);
  }, [selectedServices]);

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

      const selectedDetails = services.filter((service) =>
        data.services.includes(service.id)
      );
      const totalPrice = selectedDetails.reduce(
        (acc, service) => acc + service.price,
        0
      );

      const payload = {
        ...data,
        totalPrice,
        selectedServicesDetails: selectedDetails,
        type,
      };

      await api.submitCustomerDetails(data, "booking");

      // const response = await axios.post(
      //   // In production, use your deployed server URL
      //   // "https://airport-server-onj2.onrender.com/api/booking",
      //   "http://localhost:5000/api/booking",
      //   payload,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

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
          <div className="mb-8 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
            <p className="font-bold text-gray-800">
              NOTE: This booking process is for{" "}
              <span className="text-primary">Nigeria airports only.</span>
            </p>
            <p className="mt-2">
              For any airport protocol booking outside Nigeria,{" "}
              <a
                href="/international"
                className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
              >
                click here
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
            {type === "domestic" && (
              <>
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

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      Type of Service
                    </h3>

                    {/* ✅ Currency Toggle Button */}
                    <CurrencyToggle />
                  </div>

                  <FormDescription>
                    I would also like BTM to arrange the following for me.
                  </FormDescription>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {services.map((service) => {
                      const isSelected = selectedServices?.includes(service.id);

                      const displayPrice =
                        currency === "NGN"
                          ? `₦${service.price.toLocaleString()}`
                          : `$${service.dollar.toLocaleString()}`;

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
                                  field.onChange(
                                    field.value?.filter(
                                      (id: string) => id !== service.id
                                    )
                                  );
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

                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-800">
                                  {service.label}
                                </h4>
                                <span className="font-bold text-primary">
                                  {displayPrice}
                                </span>
                              </div>
                            </div>
                          )}
                        />
                      );
                    })}
                  </div>

                  {selectedServices?.length > 0 && (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Selected Services
                      </h4>
                      <ul className="space-y-2">
                        {selectedServices.map((id: string) => {
                          const svc = services.find((s) => s.id === id);
                          if (!svc) return null;
                          const displayPrice =
                            currency === "NGN"
                              ? `₦${svc.price.toLocaleString()}`
                              : `$${svc.dollar.toLocaleString()}`;
                          return (
                            <li key={id} className="flex justify-between">
                              <span>{svc.label}</span>
                              <span className="font-bold text-primary">
                                {displayPrice}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="flex justify-between items-center mt-4 border-t pt-4">
                        <span className="font-semibold text-gray-700">
                          Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {currency === "NGN"
                            ? `₦${totalPrice.toLocaleString()}`
                            : `$${totalDollarPrice.toLocaleString()}`}
                        </span>
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
