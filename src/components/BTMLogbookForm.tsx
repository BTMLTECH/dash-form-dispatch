import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Plane } from "lucide-react";

const formSchema = z.object({
  // Common fields
  date: z.string().min(1, "Date is required"),
  flight: z.string().min(1, "Flight number is required"),
  time: z.string().min(1, "Time is required"),
  protocolOfficer: z.string().min(1, "Protocol officer name is required"),
  passengerName: z.string().min(1, "Passenger name is required"),
  company: z.string().min(1, "Company name is required"),
  
  // Arrivals section
  meetingLocation: z.string().optional(),
  baggageAssistance: z.string().optional(),
  handoverToDriver: z.string().optional(),
  luggageNo: z.string().optional(),
  arrivalComment: z.string().optional(),
  arrivalRating: z.string().optional(),
  
  // Departures section
  protocolOfficerMeet: z.string().optional(),
  meetingPlace: z.string().optional(),
  immigrationFormProvided: z.string().optional(),
  fastTrackProvided: z.string().optional(),
  meetGreetLevel: z.string().optional(),
  handoverToAirside: z.string().optional(),
  airsideOfficerName: z.string().optional(),
  airsideOfficerTel: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const BTMLogbookForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      flight: "",
      time: "",
      protocolOfficer: "",
      passengerName: "",
      company: "",
      meetingLocation: "",
      baggageAssistance: "",
      handoverToDriver: "",
      luggageNo: "",
      arrivalComment: "",
      arrivalRating: "",
      protocolOfficerMeet: "",
      meetingPlace: "",
      immigrationFormProvided: "",
      fastTrackProvided: "",
      meetGreetLevel: "",
      handoverToAirside: "",
      airsideOfficerName: "",
      airsideOfficerTel: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Form Submitted Successfully",
      description: "Your BTM logbook entry has been recorded.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">BTM Logbook</h1>
          </div>
          <p className="text-muted-foreground">Business Travel Management</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Common Information */}
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="flight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BA123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protocolOfficer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocol Officer</FormLabel>
                      <FormControl>
                        <Input placeholder="Officer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passengerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passenger Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Arrivals Section */}
            <Card>
              <CardHeader>
                <CardTitle>Arrivals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="meetingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Where Were You Met By The Protocol Officer?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                          {["At Tunnel", "At Staircase", "At Immigrations", "At Carousel", 
                            "Outside Airport", "Inside Airport", "Other"].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`arrival-${option}`} />
                              <Label htmlFor={`arrival-${option}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="luggageNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Luggage No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter luggage number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="baggageAssistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Was Baggage Assistance Provided?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="baggage-yes" />
                            <Label htmlFor="baggage-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="baggage-no" />
                            <Label htmlFor="baggage-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="handoverToDriver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Handover To Driver</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="handover-yes" />
                            <Label htmlFor="handover-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="handover-no" />
                            <Label htmlFor="handover-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrivalComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment & Rating</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your comments here..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrivalRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2">
                              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">{rating}</Label>
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

            {/* Departures Section */}
            <Card>
              <CardHeader>
                <CardTitle>Departure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="protocolOfficerMeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Did Protocol Officer Meet?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="officer-meet-yes" />
                            <Label htmlFor="officer-meet-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="officer-meet-no" />
                            <Label htmlFor="officer-meet-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetingPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Where Did Protocol Officer Meet You?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inside" id="meet-inside" />
                            <Label htmlFor="meet-inside" className="cursor-pointer">Inside</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="outside" id="meet-outside" />
                            <Label htmlFor="meet-outside" className="cursor-pointer">Outside</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immigrationFormProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Did Protocol Officer Provide Immigration Form?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="immigration-form-yes" />
                            <Label htmlFor="immigration-form-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="immigration-form-no" />
                            <Label htmlFor="immigration-form-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fastTrackProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Was Immigration Fast Track Provided?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="fast-track-yes" />
                            <Label htmlFor="fast-track-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="fast-track-no" />
                            <Label htmlFor="fast-track-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meetGreetLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level Of Meet And Greet</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="level-standard" />
                            <Label htmlFor="level-standard" className="cursor-pointer">Standard</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vip" id="level-vip" />
                            <Label htmlFor="level-vip" className="cursor-pointer">VIP</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vvip" id="level-vvip" />
                            <Label htmlFor="level-vvip" className="cursor-pointer">VVIP</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="handoverToAirside"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passenger Handed over to Airside Officer</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="airside-yes" />
                            <Label htmlFor="airside-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="airside-no" />
                            <Label htmlFor="airside-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="airsideOfficerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airside Officer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Officer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="airsideOfficerTel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airside Officer Tel No.</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="w-full md:w-auto">
                Submit Logbook Entry
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BTMLogbookForm;
