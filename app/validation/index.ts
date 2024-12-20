import Joi from "joi";
import * as countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

// Charger les traductions (optionnel, ici en anglais)
countries.registerLocale(en);

// Récupérer la liste des codes pays valides
const validCountries = Object.keys(countries.getAlpha2Codes());

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username must not exceed 30 characters.",
    "any.required": "The 'username' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
  firstName: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "First name must be at least 2 characters long.",
    "string.max": "First name must not exceed 50 characters.",
    "any.required": "The 'firstName' field is required.",
  }),
  lastName: Joi.string().min(2).max(50).trim().required().messages({
    "string.min": "Last name must be at least 2 characters long.",
    "string.max": "Last name must not exceed 50 characters.",
    "any.required": "The 'lastName' field is required.",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  birthDate: Joi.date().optional().messages({
    "date.base": "Birth date must be a valid date.",
  }),
  city: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
});

export const createCompanySchema = Joi.object({
  companyName: Joi.string().min(3).max(30).trim().required().messages({
    "string.min": "Company name must be at least 3 characters long.",
    "string.max": "Company name must not exceed 30 characters.",
    "any.required": "The 'company name' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  companyNumber: Joi.string()
    .pattern(/^[A-Za-z0-9\-]+$/) // Remplace cette regex par celle correspondant à ton format de numéro d'entreprise
    .trim()
    .required()
    .messages({
      "string.pattern.base":
        "The 'companyNumber' must be a valid company number.",
      "any.required": "The 'companyNumber' field is required.",
    }),
  birthDate: Joi.date().optional().messages({
    "date.base": "Birth date must be a valid date.",
  }),
  city: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
  street: Joi.string().trim().min(3).max(255).required().messages({
    "string.min": "Street must be at least 3 characters long.",
    "string.max": "Street must not exceed 255 characters.",
    "any.required": "The 'street' field is required.",
  }),
});

export const createAuthSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "The 'email' field is required.",
  }),
  password: Joi.string().min(6).trim().required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "The 'password' field is required.",
  }),
});

export const messageSchema = Joi.object({
  senderUserId: Joi.string().uuid().optional().messages({
    "string.uuid": "senderUserId must be a valid UUID.",
    "any.required": "senderUserId is required.",
  }),
  senderCompanyId: Joi.string().uuid().optional().messages({
    "string.uuid": "senderCompanyId must be a valid UUID.",
    "any.required": "senderCompanyId is required.",
  }),
  receiverUserId: Joi.string().uuid().required().messages({
    "string.uuid": "receiverUserId must be a valid UUID.",
    "any.required": "receiverUserId is required.",
  }),
  receiverCompanyId: Joi.string().uuid().required().messages({
    "string.uuid": "receiverCompanyId must be a valid UUID.",
    "any.required": "receiverCompanyId is required.",
  }),
  content: Joi.string().min(1).required().messages({
    "string.min": "Content must not be empty.",
    "any.required": "Content is required.",
  }),
  read: Joi.boolean().default(false).optional().messages({
    "boolean.base": "Read must be a boolean.",
  }),
  offerId: Joi.number().optional().messages({
    "number.base": "Offer ID must be a number.",
  }), // Ajout d'une validation optionnelle pour `offerId` si besoin
});

export const vehicleSchema = Joi.object({
  vendor: Joi.string().optional().messages({
    "string.base": "Vendor must be a valid string.",
  }),
  vendorType: Joi.string().valid("company", "user").optional().messages({
    "any.only":
      "Vendor type must be one of 'Individual', 'Agency', or 'Developer'.",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().min(3).max(500).required().messages({
    "string.min": "Description must be at least 3 characters long.",
    "string.max": "Description must not exceed 500 characters.",
    "any.required": "The 'description' field is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
  vehicleType: Joi.string()
    .valid("Car", "Truck", "Motorcycle", "Van", "Bicycle", "Boat")
    .required()
    .messages({
      "string.valid":
        "Vehicle type must be one of 'Car', 'Truck', 'Motorcycle', 'Van', 'Bicycle', or 'Boat'.",
      "any.required": "The 'vehicleType' field is required.",
    }),
  model: Joi.string().min(2).max(50).required().messages({
    "string.min": "Model must be at least 2 characters long.",
    "string.max": "Model must not exceed 50 characters.",
    "any.required": "The 'model' field is required.",
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Year must be a valid number.",
      "number.min": "Year must be at least 1900.",
      "number.max": `Year must not exceed the current year (${new Date().getFullYear()}).`,
      "any.required": "The 'year' field is required.",
    }),
  mileage: Joi.number().integer().min(0).required().messages({
    "number.base": "Mileage must be a valid number.",
    "number.min": "Mileage must be a positive number.",
    "any.required": "The 'mileage' field is required.",
  }),
  fuelType: Joi.string()
    .valid("Petrol", "Diesel", "Electric", "Hybrid")
    .required()
    .messages({
      "string.valid":
        "Fuel type must be one of 'Petrol', 'Diesel', 'Electric', or 'Hybrid'.",
      "any.required": "The 'fuelType' field is required.",
    }),
  color: Joi.string().min(3).max(30).required().messages({
    "string.min": "Color must be at least 3 characters long.",
    "string.max": "Color must not exceed 30 characters.",
    "any.required": "The 'color' field is required.",
  }),
  transmission: Joi.string().valid("Manual", "Automatic").required().messages({
    "string.valid": "Transmission must be either 'Manual' or 'Automatic'.",
    "any.required": "The 'transmission' field is required.",
  }),
  numberOfDoors: Joi.number().integer().min(0).optional().messages({
    "number.base": "Number of doors must be a valid number.",
    "number.min": "Number of doors must be a positive integer.",
  }),
  engineSize: Joi.number().positive().optional().messages({
    "number.base": "Engine size must be a valid number.",
    "number.positive": "Engine size must be a positive number.",
  }),
  power: Joi.number().positive().optional().messages({
    "number.base": "Power must be a valid number.",
    "number.positive": "Power must be a positive number.",
  }),
  emissionClass: Joi.string().min(1).max(20).optional().messages({
    "string.max": "Emission class must not exceed 20 characters.",
  }),
  condition: Joi.string()
    .valid("New", "Used", "For Renovation")
    .optional()
    .messages({
      "any.only":
        "Condition must be one of 'New', 'Used', or 'For Renovation'.",
    }),
  contactNumber: Joi.string().optional().messages({
    "string.base": "Contact number must be a valid string.",
  }),
  contactEmail: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address.",
  }),
  location: Joi.boolean().optional(),
  photos: Joi.array()
    .items(Joi.string()) // Valider que chaque élément est une chaîne (pas nécessairement une URI)
    .required()
    .messages({
      "array.base": "Photos must be an array of URLs.",
      "array.includesRequiredUnknowns": "Each photo must be a valid URL.",
      "any.required": "The 'photos' field is required.",
    }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
});

export const propertySchema = Joi.object({
  vendor: Joi.string().optional().messages({
    "string.base": "Vendor must be a valid string.",
  }),
  vendorType: Joi.string().valid("company", "user").optional().messages({
    "any.only":
      "Vendor type must be one of 'Individual', 'Agency', or 'Developer'.",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().max(2500).optional().messages({
    "string.max": "Description must not exceed 2500 characters.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),
  propertyCondition: Joi.string()
    .valid("New", "Renovated", "Good", "Needs Renovation")
    .optional()
    .messages({
      "any.only":
        "Property condition must be one of 'New', 'Renovated', 'Good', or 'Needs Renovation'.",
    }),
  propertyType: Joi.string()
    .valid("Apartment", "House", "Studio", "Villa", "Commercial")
    .required()
    .messages({
      "string.valid":
        "Property type must be one of 'Apartment', 'House', 'Studio', 'Villa', or 'Commercial'.",
      "any.required": "The 'propertyType' field is required.",
    }),
  surface: Joi.number().positive().required().messages({
    "number.base": "Surface must be a valid number.",
    "number.positive": "Surface must be a positive number.",
    "any.required": "The 'surface' field is required.",
  }),
  rooms: Joi.number().integer().min(1).required().messages({
    "number.base": "Rooms must be a valid number.",
    "number.min": "There must be at least 1 room.",
    "any.required": "The 'rooms' field is required.",
  }),
  bedrooms: Joi.number().integer().min(0).required().messages({
    "number.base": "Bedrooms must be a valid number.",
    "number.min": "There must be at least 0 Bedrooms.",
    "any.required": "The 'bedrooms' field is required.",
  }),
  bathrooms: Joi.number().integer().min(0).required().messages({
    "number.base": "Bathrooms must be a valid number.",
    "number.min": "There must be at least 0 bathrooms.",
    "any.required": "The 'Bathrooms' field is required.",
  }),
  heatingType: Joi.string()
    .valid("Gas", "Electric", "Oil", "Other")
    .required()
    .messages({
      "string.base": "Heating type must be a string.",
      "any.only":
        "Heating type must be one of the following: Gas, Electric, Oil, Other.",
      "any.required": "Heating type is required.",
    }),

  energyClass: Joi.string()
    .valid("A", "B", "C", "D", "E", "F", "G")
    .required()
    .messages({
      "string.base": "Energy class must be a string.",
      "any.only":
        "Energy class must be one of the following: A, B, C, D, E, F, G.",
      "any.required": "Energy class is required.",
    }),
  furnished: Joi.boolean().required().messages({
    "any.required": "The 'furnished' field is required.",
  }),
  parking: Joi.boolean().optional(),
  garage: Joi.boolean().optional(),
  elevator: Joi.boolean().optional(),
  balcony: Joi.boolean().optional(),
  terrace: Joi.boolean().optional(),
  garden: Joi.boolean().optional(),
  basementAvailable: Joi.boolean().optional(),
  floorNumber: Joi.number().integer().min(0).optional().messages({
    "number.base": "Floor number must be a valid integer.",
    "number.min": "Floor number must be 0 or higher.",
  }),
  totalFloors: Joi.number().integer().min(1).optional().messages({
    "number.base": "Total floors must be a valid integer.",
    "number.min": "There must be at least 1 floor.",
  }),
  contactNumber: Joi.string().optional().messages({
    "string.base": "Contact number must be a valid string.",
  }),
  contactEmail: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address.",
  }),
  availabilityDate: Joi.date().optional().messages({
    "date.base": "Availability date must be a valid date.",
  }),
  location: Joi.boolean().optional(),
  photos: Joi.array()
    .items(Joi.string()) // Valider que chaque élément est une chaîne (pas nécessairement une URI)
    .required()
    .messages({
      "array.base": "Photos must be an array of URLs.",
      "array.includesRequiredUnknowns": "Each photo must be a valid URL.",
      "any.required": "The 'photos' field is required.",
    }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
});

export const commercialOfferSchema = Joi.object({
  vendor: Joi.string().optional().messages({
    "string.base": "Vendor must be a valid string.",
  }),
  vendorType: Joi.string().valid("company", "user").optional().messages({
    "any.only":
      "Vendor type must be one of 'Individual', 'Agency', or 'Developer'.",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "The 'title' field is required.",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a valid number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "The 'price' field is required.",
  }),
  city: Joi.string().min(3).max(100).required().messages({
    "string.min": "City must be at least 3 characters long.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "The 'city' field is required.",
  }),
  country: Joi.string()
    .trim()
    .valid(...validCountries)
    .required()
    .messages({
      "any.required": "The 'country' field is required.",
      "any.only": "The 'country' field must be a valid ISO country code.",
    }),

  createdAt: Joi.date().optional().messages({
    "date.base": "CreatedAt must be a valid date.",
  }),
  updatedAt: Joi.date().optional().messages({
    "date.base": "UpdatedAt must be a valid date.",
  }),
  commercialType: Joi.string()
    .valid("Product", "Service", "Promotion", "Other")
    .required()
    .messages({
      "string.valid":
        "Commercial type must be one of 'Product', 'Job', 'Publicité', or 'Other'.",
      "any.required": "The 'commercialType' field is required.",
    }),
  duration: Joi.number().integer().min(1).optional().messages({
    "number.base": "Duration must be a valid number.",
    "number.min": "Duration must be at least 1 day.",
  }),
  contractType: Joi.string()
    .valid("CDI", "CDD", "Freelance", "Internship", "Other")
    .optional()
    .messages({
      "any.only":
        "Contract type must be one of 'CDI', 'CDD', 'Freelance', 'Internship', or 'Other'.",
    }),
  workSchedule: Joi.string()
    .valid("Full-time", "Part-time", "Flexible", "Other")
    .optional()
    .messages({
      "any.only":
        "Work schedule must be one of 'Full-time', 'Part-time', 'Flexible', or 'Other'.",
    }),
  contactNumber: Joi.string().optional().messages({
    "string.base": "Contact number must be a valid string.",
  }),
  contactEmail: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address.",
  }),
  photos: Joi.array()
    .items(Joi.string()) // Valider que chaque élément est une chaîne (pas nécessairement une URI)
    .required()
    .messages({
      "array.base": "Photos must be an array of URLs.",
      "array.includesRequiredUnknowns": "Each photo must be a valid URL.",
      "any.required": "The 'photos' field is required.",
    }),
  userId: Joi.string().uuid().optional().messages({
    "string.uuid": "User ID must be a valid UUID.",
  }),
  companyId: Joi.string().uuid().optional().messages({
    "string.uuid": "Company ID must be a valid UUID.",
  }),
  categories: Joi.array()
    .items(
      Joi.string().valid(
        "Electronics",
        "Fashion",
        "Home",
        "Toys",
        "Books",
        "Automotive",
        "Sports",
        "Health & Beauty",
        "Food & Beverage",
        "Art & Crafts",
        "Real Estate",
        "Education",
        "Entertainment",
        "Pets",
        "Other"
      )
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Categories must be an array of strings.",
      "array.min": "At least one category must be selected.",
      "any.required": "The 'categories' field is required.",
    }),

  openingHours: Joi.object({
    Monday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).required(),
    Tuesday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).required(),
    Wednesday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).required(),
    Thursday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).required(),
    Friday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).required(),
    Saturday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).optional(),
    Sunday: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      end: Joi.string()
        .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    }).optional(),
  })
    .required()
    .messages({
      "object.base": "Opening hours must be a valid object.",
      "any.required": "The 'openingHours' field is required.",
    }),
});

const ReporterTypeEnum = Joi.string().valid("user", "company").required();

export const reportSchema = Joi.object({
  reason: Joi.string().min(3).max(500).required().messages({
    "string.min": "Reason must be at least 3 characters long.",
    "string.max": "Reason must not exceed 500 characters.",
    "any.required": "The 'reason' field is required.",
  }),
  createdAt: Joi.date().optional().messages({
    "date.base": "CreatedAt must be a valid date.",
  }),
  status: Joi.string()
    .valid("pending", "resolved", "rejected")
    .default("pending")
    .required()
    .messages({
      "string.valid":
        "Status must be one of 'pending', 'resolved', or 'rejected'.",
      "any.required": "The 'status' field is required.",
    }),
  vehicleOfferId: Joi.number().integer().optional().messages({
    "number.base": "Vehicle offer ID must be a valid number.",
  }),
  realEstateOfferId: Joi.number().integer().optional().messages({
    "number.base": "Real estate offer ID must be a valid number.",
  }),
  commercialOfferId: Joi.number().integer().optional().messages({
    "number.base": "Commercial offer ID must be a valid number.",
  }),
  reporterId: Joi.string().uuid().required().messages({
    "string.uuid": "Reporter ID must be a valid UUID.",
    "any.required": "The 'reporterId' field is required.",
  }),
  reporterType: ReporterTypeEnum.messages({
    "any.required": "The 'reporterType' field is required.",
  }),
});
