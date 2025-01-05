export interface Property {
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    country?: string;
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
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    country?: string;
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
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    country?: string;
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