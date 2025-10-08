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
    arrivalRating: z.string().optional(),

    // Departure Section
    protocolOfficerMeet: z.string().optional(),
    immigrationAssistance: z.string().optional(),
    meetGreetLevel: z.string().optional(),
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
    }
  });

type FormData = z.infer<typeof formSchema>;

const BTMLogbookForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      meetingLocation: "",
      luggageNo: "",
      arrivalComment: "",
      arrivalRating: "",
      protocolOfficerMeet: "",
      immigrationAssistance: "",
      meetGreetLevel: "",
    },
  });
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "https://airport-server-onj2.onrender.com/api/feedback",
        // "http://localhost:5000/api/feedback",
        data
      );

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
      console.error("Error submitting form:", error);
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ✅ Professional Header */}
        <header className="relative flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img
              src="/assets/btm.png"
              alt="BTM Logo"
              className="h-14 w-auto drop-shadow-md"
            />
            <div className="text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#E86700]">
                BTM Airport Services Feedback
              </h1>
            </div>
          </div>

          {/* Decorative line under header */}
          <div className="w-24 h-1 bg-[#E86700] rounded-full mt-2"></div>
        </header>

        {/* ✅ Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Service Type Card */}
            <Card className="shadow-sm border-t-4 border-[#E86700]">
              <CardHeader>
                <CardTitle className="text-[#E86700]">Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
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
                              className="text-[#E86700]"
                            />
                            <label
                              htmlFor="arrival"
                              className="cursor-pointer text-gray-700"
                            >
                              Arrival
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="departure"
                              id="departure"
                              className="text-[#E86700]"
                            />
                            <label
                              htmlFor="departure"
                              className="cursor-pointer text-gray-700"
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
            {selectedService === "arrival" && (
              <Card className="shadow-sm border-t-4 border-[#E86700]">
                <CardHeader>
                  <CardTitle className="text-[#E86700]">Arrival</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="meetingLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Were you met by the Protocol Officer?
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
                                id="met-yes"
                                className="text-[#E86700]"
                              />
                              <label htmlFor="met-yes">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="met-no"
                                className="text-[#E86700]"
                              />
                              <label htmlFor="met-no">No</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Luggage No */}
                  <FormField
                    control={form.control}
                    name="luggageNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luggage No.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter luggage number"
                            {...field}
                            className="border border-gray-300 rounded-md hover:border-[#E86700] focus:outline-none focus:ring-0 focus:border-[#E86700]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Comment */}
                  <FormField
                    control={form.control}
                    name="arrivalComment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your comments here..."
                            rows={4}
                            {...field}
                            className="border border-gray-300 rounded-md hover:border-[#E86700] focus:outline-none focus:ring-0 focus:border-[#E86700]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ✅ Emoji Rating (Arrival) */}
                  <FormField
                    control={form.control}
                    name="arrivalRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1 = Worst, 5 = Excellent)</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex justify-between max-w-sm mt-2"
                          >
                            {[
                              { num: 1, icon: "😡" },
                              { num: 2, icon: "😞" },
                              { num: 3, icon: "😐" },
                              { num: 4, icon: "😊" },
                              { num: 5, icon: "😍" },
                            ].map(({ num, icon }) => (
                              <div
                                key={num}
                                className="flex flex-col items-center space-y-1"
                              >
                                <RadioGroupItem
                                  value={num.toString()}
                                  id={`rating-${num}`}
                                  className="text-[#E86700] focus:ring-[#E86700]"
                                />
                                <label
                                  htmlFor={`rating-${num}`}
                                  className="text-xl"
                                >
                                  {icon}
                                </label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* ✅ Departure Section */}
            {/* ✅ Departure Section */}
            {selectedService === "departure" && (
              <Card className="shadow-sm border-t-4 border-[#E86700]">
                <CardHeader>
                  <CardTitle className="text-[#E86700]">Departure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Did protocol officer meet you? */}
                  <FormField
                    control={form.control}
                    name="protocolOfficerMeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Did protocol officer meet you?</FormLabel>
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
                                className="text-[#E86700]"
                              />
                              <label htmlFor="departure-meet-yes">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="departure-meet-no"
                                className="text-[#E86700]"
                              />
                              <label htmlFor="departure-meet-no">No</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Immigration Assistance */}
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
                                className="text-[#E86700]"
                              />
                              <label htmlFor="immigration-yes">Yes</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="immigration-no"
                                className="text-[#E86700]"
                              />
                              <label htmlFor="immigration-no">No</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Immigration Type — only if yes */}
                  {form.watch("immigrationAssistance") === "yes" && (
                    <FormField
                      control={form.control}
                      name="meetGreetLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Immigration Assistance Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="standard"
                                  id="standard"
                                  className="text-[#E86700]"
                                />
                                <label htmlFor="standard">Standard</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="vip"
                                  id="vip"
                                  className="text-[#E86700]"
                                />
                                <label htmlFor="vip">VIP</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="vvip"
                                  id="vvip"
                                  className="text-[#E86700]"
                                />
                                <label htmlFor="vvip">VVIP</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* ✅ Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-[#E86700] hover:bg-[#cf5900] transition-colors"
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
              <DialogTitle className="text-[#E86700]">
                🎉 Thank you!
              </DialogTitle>
            </DialogHeader>
            <p>
              Thank you very much for filling our form. Would you like to book
              your next airport assistance?
            </p>
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowSuccess(false)}
                className="bg-[#E86700] hover:bg-[#cf5900]"
              >
                No
              </Button>
              <Button
                className="bg-[#E86700] hover:bg-[#cf5900]"
                onClick={() => {
                  setShowSuccess(false);
                  window.open(
                    "https://airport-protocol.onrender.com/",
                    "_blank"
                  );
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
