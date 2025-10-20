import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import ReusableHeader from "./ReusableHeader";

export const formSchema = z
  .object({
    // Common
    serviceType: z
      .union([z.enum(["arrival", "departure"]), z.literal("")])
      .refine((val) => val !== "", {
        message: "Please select a service type",
      }),

    // Arrival Section
    meetingLocation: z.string().optional(),
    luggageNo: z.string().optional(),
    arrivalComment: z.string().optional(),
    departureComment: z.string().optional(),
    arrivalRating: z.string().optional(),
    departureRating: z.string().optional(),

    // Departure Section
    protocolOfficerMeet: z.string().optional(),
    immigrationAssistance: z.string().optional(),
    meetInOrOutside: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ Conditional validation: only validate the selected service
    if (data.serviceType === "arrival") {
      if (!data.meetingLocation) {
        ctx.addIssue({
          path: ["meetingLocation"],
          message: "Please select an option",
          code: "custom",
        });
      }
      if (!data.arrivalRating) {
        ctx.addIssue({
          path: ["arrivalRating"],
          message: "Please provide a rating",
          code: "custom",
        });
      }
    } else if (data.serviceType === "departure") {
      if (!data.protocolOfficerMeet) {
        ctx.addIssue({
          path: ["protocolOfficerMeet"],
          message: "Please select an option",
          code: "custom",
        });
      }
      if (!data.immigrationAssistance) {
        ctx.addIssue({
          path: ["immigrationAssistance"],
          message: "Please select an option",
          code: "custom",
        });
      }
      if (!data.meetInOrOutside) {
        ctx.addIssue({
          path: ["meetInOrOutside"],
          message: "Please select an option",
          code: "custom",
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

const BTMLogbookForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      meetingLocation: "",
      luggageNo: "",
      arrivalComment: "",
      departureComment: "",
      arrivalRating: "",
      departureRating: "",
      protocolOfficerMeet: "",
      immigrationAssistance: "",
      meetInOrOutside: "",
    },
  });
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const response = await api.submitCustomerDetails(data, "feedback");

      // const response = await axios.post(
      //   "https://airport-protocol.onrender.com/api/feedback",
      //   // "http://localhost:5000/api/feedback",
      //   data
      // );

      if (response.data.success) {
        toast({
          title: "Form Submitted Successfully",
          description: "Your BTM logbook entry has been recorded.",
        });
        form.reset();
        setShowSuccess(true);
      } else {
        toast({
          title: "Submission Failed",
          description: response.data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Server Error",
        description: "Could not connect to the server.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = form.watch("serviceType");

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <ReusableHeader
          title="BTM Airport Services Feedback"
          description=" Your feedback helps us improve your experience"
        />

        {/* ✅ Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Service Type Card */}
            <Card className="shadow-sm border-t-4 border-primary bg-card text-card-foreground">
              <CardHeader>
                <CardTitle className="text-primary">Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-foreground">
                        Did you book BTM protocol service for?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="arrival"
                              id="arrival"
                              className="text-primary"
                            />
                            <label htmlFor="arrival" className="cursor-pointer">
                              Arrival
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="departure"
                              id="departure"
                              className="text-primary"
                            />
                            <label
                              htmlFor="departure"
                              className="cursor-pointer"
                            >
                              Departure
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ✅ Arrival Section */}
            {/* ✅ Condensed Arrival Feedback Section */}
            {/* ✅ Condensed Arrival Feedback Section */}
            {selectedService === "arrival" && (
              <Card className="shadow-sm border-t-4 border-primary bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Arrival Feedback
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 🧍 Where Were You Met */}
                  <FormField
                    control={form.control}
                    name="meetingLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Where were you met?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="immigration"
                                id="met-immigration"
                              />
                              <label htmlFor="met-immigration">
                                Immigration
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="outside-hall"
                                id="met-outside"
                              />
                              <label htmlFor="met-outside">
                                Outside the hall
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ⭐ Rating 1–10 */}
                  <FormField
                    control={form.control}
                    name="arrivalRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate your experience (1–10)</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-2 mt-2"
                          >
                            {[...Array(10)].map((_, i) => {
                              const val = (i + 1).toString();

                              // 🎭 Custom emoji per rating
                              const emojis = [
                                "😡", // 1
                                "😠", // 2
                                "😞", // 3
                                "😕", // 4
                                "😐", // 5
                                "🙂", // 6
                                "😊", // 7
                                "😃", // 8
                                "🤩", // 9
                                "😍", // 10
                              ];
                              const emoji = emojis[i];

                              return (
                                <label
                                  key={val}
                                  htmlFor={`rating-${val}`}
                                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-md border text-sm cursor-pointer select-none transition-all ${
                                    field.value === val
                                      ? "bg-primary text-white border-primary shadow-sm scale-105"
                                      : "hover:bg-gray-100 border-gray-300"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={val}
                                    id={`rating-${val}`}
                                    className="sr-only"
                                  />
                                  <span className="text-lg leading-none">
                                    {emoji}
                                  </span>
                                  <span
                                    className={`text-xs mt-1 ${
                                      field.value === val
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                </label>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>

                        {field.value && (
                          <p className="text-sm text-gray-600 mt-2">
                            You rated your experience:{" "}
                            <strong className="text-primary">
                              {field.value}/10
                            </strong>
                          </p>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 💬 Optional Comment */}
                  <FormField
                    control={form.control}
                    name="arrivalComment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Additional Comments{" "}
                          <span className="text-sm text-gray-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Type your feedback (optional)..."
                            rows={2}
                            className="border border-border rounded-md focus:outline-none focus:ring-0 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* ✅ Departure Section */}
            {selectedService === "departure" && (
              <Card className="shadow-sm border-t-4 border-primary bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Departure Feedback
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 1️⃣ Protocol Officer Meet */}
                  <FormField
                    control={form.control}
                    name="protocolOfficerMeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Did the Protocol Officer meet you?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="departure-meet-yes"
                              />
                              <label htmlFor="departure-meet-yes">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="departure-meet-no"
                              />
                              <label htmlFor="departure-meet-no">No</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 2️⃣ Meeting Location (swapped up) */}
                  <FormField
                    control={form.control}
                    name="meetInOrOutside"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Where did the Protocol Officer meet you?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="inside" id="meet-inside" />
                              <label htmlFor="meet-inside">Inside</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="outside"
                                id="meet-outside"
                              />
                              <label htmlFor="meet-outside">Outside</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 3️⃣ Immigration Assistance (moved down) */}
                  <FormField
                    control={form.control}
                    name="immigrationAssistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Were you assisted through immigration?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="immigration-yes"
                              />
                              <label htmlFor="immigration-yes">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="immigration-no" />
                              <label htmlFor="immigration-no">No</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 4️⃣ Feedback Rating */}
                  <FormField
                    control={form.control}
                    name="departureRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Rate your overall experience (1–10)
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-2 mt-2"
                          >
                            {[...Array(10)].map((_, i) => {
                              const val = (i + 1).toString();
                              const emojis = [
                                "😡", // 1
                                "😠", // 2
                                "😞", // 3
                                "😕", // 4
                                "😐", // 5
                                "🙂", // 6
                                "😊", // 7
                                "😃", // 8
                                "🤩", // 9
                                "😍", // 10
                              ];
                              const emoji = emojis[i];

                              return (
                                <label
                                  key={val}
                                  htmlFor={`departure-rating-${val}`}
                                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-md border text-sm cursor-pointer select-none transition-all ${
                                    field.value === val
                                      ? "bg-primary text-white border-primary shadow-sm scale-105"
                                      : "hover:bg-gray-100 border-gray-300"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={val}
                                    id={`departure-rating-${val}`}
                                    className="sr-only"
                                  />
                                  <span className="text-lg leading-none">
                                    {emoji}
                                  </span>
                                  <span
                                    className={`text-xs mt-1 ${
                                      field.value === val
                                        ? "text-white"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                </label>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                        {field.value && (
                          <p className="text-sm text-gray-600 mt-1">
                            You rated: <strong>{field.value}/10</strong>
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 5️⃣ Optional Comment */}
                  <FormField
                    control={form.control}
                    name="departureComment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Additional Comments{" "}
                          <span className="text-sm text-gray-500">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Type any feedback here..."
                            rows={2}
                            className="border border-border rounded-md focus:outline-none focus:ring-0 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* ✅ Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">🎉 Thank you!</DialogTitle>
            </DialogHeader>
            <p>
              Thank you very much for filling our form. Would you like to book
              your next airport assistance?
            </p>
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowSuccess(false)}
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
              >
                No
              </Button>
              {/* <Button
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
                onClick={() => {
                  setShowSuccess(false);
                  window.open(
                    "https://airport-protocol.onrender.com/",
                    "_blank"
                  );
                }}
              >
                Yes
              </Button> */}

              <Button
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/");
                }}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BTMLogbookForm;
