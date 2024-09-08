export interface User {
  user_id?: number;
  client_id: number;
  helper_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  City: { name: string };
  city_name: string;
  city_id: number;
  roleName: string;
  email: string;
}
