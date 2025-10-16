export const primaryServices = [
  {
    id: "standard-meet-greet",
    label: "Standard Meet & Greet",
    price: 20000,
    dollar: 20,
  },
  { id: "vip-meet-greet", label: "VIP Meet & Greet", price: 35000, dollar: 40 },
];

// export const additionalServices = [
//   { id: "car-hire", label: "Car Hire", price: 0, dollar: 0 },
//   { id: "airport-transfer", label: "Airport Transfer", price: 0, dollar: 0 },
//   { id: "lounge-services", label: "Lounge Services", price: 40000, dollar: 20 },
//   {
//     id: "escort-services",
//     label: "Security Escort Vehicle",
//     price: 0,
//     dollar: 0,
//   },
//   {
//     id: "tour-entertainment",
//     label: "Tour / Entertainment",
//     price: 0,
//     dollar: 0,
//   },
// ];

// 🧩 Define a reusable type for options
type ServiceOption = {
  type: string;
  priceRange: string;
  // dollarRange: string;
};

// 🧱 Define the full shape of additional services
export type AdditionalService =
  | {
      id: string;
      label: string;
      price: number;
      dollar: number;
      options?: undefined;
    }
  | {
      id: string;
      label: string;
      options: ServiceOption[];
      price?: undefined;
      dollar?: undefined;
    };

export const additionalServices: AdditionalService[] = [
  {
    id: "car-hire",
    label: "Car Hire",
    options: [
      { type: "Bus", priceRange: "₦170,000 - ₦200,000" },
      { type: "Saloon", priceRange: "₦150,000 - ₦180,000" },
      { type: "SUV", priceRange: "₦205,000 - ₦280,000" },
    ],
  },
  {
    id: "airport-transfer",
    label: "Airport Transfer",
    options: [
      { type: "Saloon Car", priceRange: "₦90,000" },
      { type: "SUV", priceRange: "₦130,000 - ₦180,000" },
    ],
  },
  {
    id: "lounge-services",
    label: "Lounge Services",
    price: 40000, // NGN
    dollar: 20, // USD (already known)
  },
  {
    id: "escort-services",
    label: "Security Escort Vehicle",
    options: [
      { type: "Half Day", priceRange: "₦103,000 - ₦150,000" },
      { type: "Full Day", priceRange: "₦210,000 - ₦250,000" },
    ],
  },
  {
    id: "tour-entertainment",
    label: "Tour / Entertainment",
    price: 0,
    dollar: 0,
  },
];

export const referralSources = [
  "Google Search",
  "Social Media",
  "Friend/Family Referral",
  "Travel Agency",
  "Previous Customer",
  "Advertisement",
  "Other",
];

export const departureCities = [
  "London",
  "New York",
  "Dubai",
  "Paris",
  "Johannesburg",
  "Other",
];
export const domesticCities = [
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

export const internationalCities = ["Lagos", "Abuja", "Port Harcourt", "Kano"];
