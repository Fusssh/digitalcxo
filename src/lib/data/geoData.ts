export interface CountryData {
  country: string;
  states: {
    state: string;
    cities: string[];
  }[];
}

export const geoData: CountryData[] = [
  {
    country: "India",
    states: [
      {
        state: "Delhi NCR",
        cities: ["New Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad", "Greater Noida"]
      },
      {
        state: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Navi Mumbai", "Nashik", "Aurangabad"]
      },
      {
        state: "Karnataka",
        cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"]
      },
      {
        state: "Tamil Nadu",
        cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
      },
      {
        state: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Secunderabad"]
      },
      {
        state: "Gujarat",
        cities: ["Ahmedabad", "Gandhinagar", "Surat", "Vadodara", "Rajkot"]
      },
      {
        state: "Uttar Pradesh",
        cities: ["Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Agra", "Meerut"]
      },
      {
        state: "West Bengal",
        cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"]
      },
      {
        state: "Haryana",
        cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Panchkula"]
      },
      {
        state: "Kerala",
        cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"]
      },
      {
        state: "Rajasthan",
        cities: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Bikaner"]
      },
      {
        state: "Punjab",
        cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Mohali"]
      },
      {
        state: "Madhya Pradesh",
        cities: ["Indore", "Bhopal", "Gwalior", "Jabalpur"]
      },
      {
        state: "Andhra Pradesh",
        cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"]
      },
      {
        state: "Odisha",
        cities: ["Bhubaneswar", "Cuttack", "Rourkela"]
      }
    ]
  },
  {
    country: "United Arab Emirates",
    states: [
      {
        state: "Dubai",
        cities: ["Dubai City", "Deira", "Jumeirah", "Business Bay", "DIFC"]
      },
      {
        state: "Abu Dhabi",
        cities: ["Abu Dhabi City", "Al Ain", "Al Dhafra"]
      },
      {
        state: "Sharjah",
        cities: ["Sharjah City", "Khor Fakkan"]
      }
    ]
  },
  {
    country: "Singapore",
    states: [
      {
        state: "Central Region",
        cities: ["Singapore CBD", "Marina Bay", "Orchard"]
      },
      {
        state: "West Region",
        cities: ["Jurong East", "Clementi"]
      }
    ]
  },
  {
    country: "United States",
    states: [
      {
        state: "California",
        cities: ["San Francisco", "San Jose", "Palo Alto", "Los Angeles", "San Diego"]
      },
      {
        state: "New York",
        cities: ["New York City", "Buffalo", "Rochester", "Albany"]
      },
      {
        state: "Texas",
        cities: ["Austin", "Dallas", "Houston", "San Antonio"]
      },
      {
        state: "Washington",
        cities: ["Seattle", "Bellevue", "Redmond", "Tacoma"]
      }
    ]
  },
  {
    country: "United Kingdom",
    states: [
      {
        state: "Greater London",
        cities: ["London", "City of London", "Westminster", "Canary Wharf"]
      },
      {
        state: "North West",
        cities: ["Manchester", "Liverpool"]
      },
      {
        state: "West Midlands",
        cities: ["Birmingham", "Coventry"]
      }
    ]
  }
];

export function getCountries(): string[] {
  return geoData.map((g) => g.country);
}

export function getStatesForCountry(countryName: string): string[] {
  const found = geoData.find((g) => g.country.toLowerCase() === countryName.toLowerCase());
  return found ? found.states.map((s) => s.state) : [];
}

export function getCitiesForState(countryName: string, stateName: string): string[] {
  const found = geoData.find((g) => g.country.toLowerCase() === countryName.toLowerCase());
  if (!found) return [];
  const stateFound = found.states.find((s) => s.state.toLowerCase() === stateName.toLowerCase());
  return stateFound ? stateFound.cities : [];
}
