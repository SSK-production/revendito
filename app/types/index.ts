export interface Property {
    propertyType?: string;
    propertyCondition?: string;
    surface?: number;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    heatingType?: string;
    energyClass?: string;
    furnished?: boolean;
    parking?: boolean;
    garage?: boolean;
    elevator?: boolean;
    balcony?: boolean;
    terrace?: boolean;
    garden?: boolean;
    basementAvailable?: boolean;
    floorNumber?: number;
    totalFloor?: number;
    avaibilabilityDate?: Date;
    contactNumber?: string;
    contactEmail?: string;
    location?: boolean;
  }

  export interface Vehicle {
    vehicleType?: string;
    model?: string;
    year?: number;
    mileage?: number;
    fuelType?: string;
    color?: string;
    transmission?: string;
    numberOfDoors?: number;
    engineSize?: number;
    power?: number;
    emissionClass?: string;
    condition?: string;
    contactNumber?: string;
    contactEmail?: string;
    location?: boolean;
  }

  export interface Commercial {
    commercialType?: string;
    duration?: number;
    contractType?: string;
    workSchedule?: string;
    contactNumber?: string;
    contactEmail?: string;
    openingHours?: string | object;
    categories?: string[];
  }

  export interface Offers {
    id: number;
    title: string;
    description: string;
    photos: string[];
    price: number;
    city: string;
    country: string;
    active: boolean;
    validated: boolean;
    createdAt: string;
    updatedAt: string;
  }