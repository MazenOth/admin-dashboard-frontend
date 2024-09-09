export interface User {
  user_id?: number;
  client_id: number;
  helper_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  city_name: string;
  city_id: number;
  role_name: string;
  email: string;
}

export interface MatchedUser {
  matching_id: number;
  helper_id: number;
  client_id: number;
  client_first_name: string;
  client_last_name: string;
  client_phone_number: string;
  client_email: string;
  helper_first_name: string;
  helper_last_name: string;
  helper_phone_number: string;
  helper_email: string;
  city_name: string;
}
