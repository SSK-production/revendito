// On retrouve toutes les interfaces utilitaires de touts les formulaires 

//Interface Company for Backend and Frontend 
export interface CompanyData {
    companyName: string;
    password: string;
    email: string;
    companyNumber: string;
    birthDate: string;
    city: string;
    country: string;
    street: string;

}

//Interface User for Backend and Frontend 
export interface userData {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    city: string;
    country: string;
    profilePicture?: File;
}