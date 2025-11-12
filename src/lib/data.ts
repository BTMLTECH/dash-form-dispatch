
export const primaryServices = [
  {
    id: "standard-meet-greet",
    label: "Standard Meet & Greet",
    prices: { domestic: 15000, international: 20000 },
    tag: "online",
  },
  {
    id: "vip-meet-greet",
    label: "VIP Meet & Greet",
    prices: { domestic: 30000, international: 35000 },
    tag: "online",
  },
];



export type ServiceOption = {
  type: string;
  priceRange: string;
};

export type AdditionalService =
  | {
      id: string;
      label: string;
      price: number;
      tag: "offline";
      options?: undefined;
    }
  | {
      id: string;
      label: string;
      options: ServiceOption[];
      tag: "offline";
      price?: undefined;
    };

export const additionalServices: AdditionalService[] = [
  {
    id: "car-hire",
    label: "Car Hire",
    tag: "offline",
    options: [
      { type: "Bus", priceRange: "₦170,000 - ₦200,000" },
      { type: "Saloon", priceRange: "₦150,000 - ₦180,000" },
      { type: "SUV", priceRange: "₦205,000 - ₦280,000" },
    ],
  },
  {
    id: "airport-transfer",
    label: "Airport Transfer",
    tag: "offline",
    options: [
      { type: "Saloon Car", priceRange: "₦90,000" },
      { type: "SUV", priceRange: "₦130,000 - ₦180,000" },
    ],
  },
  {
    id: "lounge-services",
    label: "International Lounge Access",
    price: 30200, 
    tag: "offline",
  },
  {
    id: "escort-services",
    label: "Security Escort Vehicle",
    tag: "offline",
    options: [
      { type: "Half Day", priceRange: "₦103,000 - ₦150,000" },
      { type: "Full Day", priceRange: "₦210,000 - ₦250,000" },
    ],
  },
  {
    id: "tour-entertainment",
    label: "Tour / Entertainment",
    price: 0,
    tag: "offline",
  },
];

export const referralSources = [
  "Google Search",
  "Social Media",
  "Friend/Family Referral",
  "Travel Agency",
  "Previous Customer",
  "Advertisement",

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
