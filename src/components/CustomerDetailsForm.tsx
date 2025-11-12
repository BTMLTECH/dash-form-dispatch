import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import ReusableHeader from "./ReusableHeader";

// const formSchema = z.object({

const formSchema = z
  .object({
    passengerName: z.string().min(1, "Passenger name is required"),
    contact: z.string().min(1, "Contact number is required"),
    email: z.string().email("Invalid email address"),

    // Updated Protocol Officer Fields
    btmProtocolOfficerName: z
      .string()
      .min(1, "BTM Protocol Officer Name is required"),
    partnerProtocolOfficerName: z
      .string()
      .min(1, "Airport Partner Protocol Officer Name is required"),
    partnerProtocolOfficerMobile: z
      .string()
      .min(1, "Partner Protocol Officer Mobile Number is required"),

    badgeVerification: z
      .enum(["yes", "no"])
      .refine((val) => val !== undefined, {
        message: "Please select badge verification",
      }),

    checkInIssues: z.enum(["yes", "no"]).refine((val) => val !== undefined, {
      message: "Please select if there were any issues",
    }),

    checkInComment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.checkInIssues === "yes") {
        return data.checkInComment && data.checkInComment.trim().length > 0;
      }
      return true;
    },
    {
      path: ["checkInComment"],
      message: "Please provide details about the check-in issues",
    }
  );


export default function CheckInReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengerName: "",
      contact: "",
      email: "",
      btmProtocolOfficerName: "",
      partnerProtocolOfficerName: "",
      partnerProtocolOfficerMobile: "",
      badgeVerification: undefined,
      checkInIssues: undefined,
      checkInComment: "",
    },
  });
const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    setIsSubmitting(true);

    const response = await api.submitCustomerDetails(values, "customer");

    // Check based on success flag
    if (response?.success) {
      toast({
        title: "✅ Customer Details Submitted",
        description: response.message || "Your customer details have been recorded successfully.",
      });
      form.reset();
    } else {
      toast({
        title: "❌ Submission Failed",
        description: response?.message || "Something went wrong while submitting your details.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("❌ onSubmit error:", error);

    toast({
      title: "Server Error",
      description: "Could not connect to the server.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ✅ Elegant Header */}
        <ReusableHeader
          title="Customer Details Form"
          description="Please fill out this form for each passenger"
        />

        {/* ✅ Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-sm border border-gray-300">
              <CardHeader>
                <CardTitle className="text-primary">
                  Passenger Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Passenger Name */}
                <FormField
                  control={form.control}
                  name="passengerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passenger Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter passenger name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Number (Include country code)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 3509" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Protocol Section */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Protocol Officer Details
                  </h3>

                  {/* BTM Protocol Officer Name */}
                  <FormField
                    control={form.control}
                    name="btmProtocolOfficerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BTM Protocol Officer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter BTM officer name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Airport Partner Protocol Officer Name */}
                  <FormField
                    control={form.control}
                    name="partnerProtocolOfficerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Airport Partner Protocol Officer Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter partner officer name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Partner Protocol Officer Mobile */}
                  <FormField
                    control={form.control}
                    name="partnerProtocolOfficerMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Partner Protocol Officer Mobile Number
                          <span className="text-gray-500 text-sm ml-1">
                            (Needed in case of flight delay or passenger issue)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 987 654 3210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Badge Verification */}
                <FormField
                  control={form.control}
                  name="badgeVerification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Verification</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="badge-yes" />
                            <label htmlFor="badge-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="badge-no" />
                            <label htmlFor="badge-no">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Check-in Issues */}
                <FormField
                  control={form.control}
                  name="checkInIssues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any issues during check-in?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="issues-yes" />
                            <label htmlFor="issues-yes">Yes</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="issues-no" />
                            <label htmlFor="issues-no">No</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional Comment Field */}
                {form.watch("checkInIssues") === "yes" && (
                  <FormField
                    control={form.control}
                    name="checkInComment"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Please describe the issue</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Provide details about the check-in issues"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-[hsl(240_4%_80%)] text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Customer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
