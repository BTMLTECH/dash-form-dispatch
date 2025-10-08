import { useState } from "react";
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

const formSchema = z.object({
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
  airportTerminal: z.string().optional(),
  passengers: z.string().min(1, "Number of passengers is required"),
  specialRequests: z.string().optional(),
  discountCode: z.string().optional(),
  referralSource: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const services = [
  { id: "vip-meet-greet", label: "VIP Meet and Greet" },
  { id: "standard-meet-greet", label: "Standard Meet and Greet" },
  { id: "car-hire", label: "Car Hire" },
  { id: "airport-transfer", label: "Airport Transfer" },
  { id: "lounge-services", label: "Lounge Services" },
  { id: "escort-services", label: "Escort Services" },
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

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      airportTerminal: "",
      passengers: "",
      specialRequests: "",
      discountCode: "",
      referralSource: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // ✅ Send data to backend
      const response = await axios.post(
        "https://airport-server-onj2.onrender.com/api/booking",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    <div className="w-full max-w-4xl mx-auto">
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
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                        placeholder="john@example.com"
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
                    <FormLabel>Phone Number (Include country code) *</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Type of Service
            </h3>

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormDescription>
                    For Bundled Services, feel free to tick more than one box
                  </FormDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {services.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service.id}
                              className="flex items-center space-x-3 space-y-0 rounded-lg border border-border p-4 transition-all hover:shadow-md hover:border-primary/50"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          service.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {service.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                name="airportTerminal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Airport Name & Terminal
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Optional but helpful" {...field} />
                    </FormControl>
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
                      <Input type="number" min="1" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Information Section */}
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
                      <SelectContent>
                        {referralSources.map((source) => (
                          <SelectItem
                            key={source}
                            value={source.toLowerCase().replace(/\s+/g, "-")}
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

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px] text-base"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
