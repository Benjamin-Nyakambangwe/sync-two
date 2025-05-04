import { column, Schema, Table } from '@powersync/react-native';

const hr_employees = new Table({
  // Primary key and relations (Image 1)
  id: column.integer,
  resource_id: column.integer,
  company_id: column.integer,
  resource_calendar_id: column.integer,
  message_main_attachment_id: column.integer,
  color: column.integer,
  department_id: column.integer,
  job_id: column.integer,
  address_id: column.integer,
  work_contact_id: column.integer,
  work_location_id: column.integer,
  user_id: column.integer,
  parent_id: column.integer,
  
  // Additional IDs and relationships (Image 2)
  coach_id: column.integer,
  private_state_id: column.integer,
  private_country_id: column.integer,
  country_id: column.integer,
  children: column.integer,
  country_of_birth: column.integer,
  bank_account_id: column.integer,
  distance_home_work: column.integer,
  km_home_work: column.integer,
  departure_reason_id: column.integer,
  create_uid: column.integer,
  write_uid: column.integer,
  
  // Personal and contact information (Images 3 & 4)
  name: column.text,
  job_title: column.text,
  work_phone: column.text,
  mobile_phone: column.text,
  work_email: column.text,
  private_street: column.text,
  private_street2: column.text,
  private_city: column.text, 
  private_zip: column.text,
  private_phone: column.text,
  private_email: column.text,
  lang: column.text,
  gender: column.text,
  marital: column.text,
  spouse_complete_name: column.text,
  place_of_birth: column.text,
  ssnid: column.text,
  sinid: column.text,
  identification_id: column.text,
  passport_id: column.text,
  
  // Documents and additional info (Image 5)
  permit_no: column.text,
  visa_no: column.text,
  certificate: column.text,
  study_field: column.text,
  study_school: column.text,
  emergency_contact: column.text,
  emergency_phone: column.text,
  distance_home_work_unit: column.text,
  employee_type: column.text,
  barcode: column.text,
  pin: column.text,
  
  // More fields and dates (Image 6)
  private_car_plate: column.text,
  spouse_birthdate: column.text, // Using text for dates
  birthday: column.text, // Using text for dates
  visa_expire: column.text, // Using text for dates
  work_permit_expiration_date: column.text, // Using text for dates
  departure_date: column.text, // Using text for dates
  employee_properties: column.text, // Using text for jsonb
  additional_note: column.text,
  notes: column.text,
  departure_description: column.text,
  active: column.integer, // Using integer for boolean (0/1)
  is_flexible: column.integer, // Using integer for boolean
  is_fully_flexible: column.integer, // Using integer for boolean
  
  // Final fields (Images 7 & 8)
  work_permit_scheduled_activity: column.integer, // Using integer for boolean
  create_date: column.text, // Using text for timestamp
  write_date: column.text, // Using text for timestamp
  filter_job_position: column.integer,
  manager_id: column.integer,
  region_id: column.integer,
  employee_code: column.text,
  hourly_cost: column.real, // Using real for numeric
  timesheet_manager_id: column.integer,
  last_validated_timesheet_date: column.text, // Using text for date
  mobile_app_password: column.text
},
{
  indexes: { 
    department: ['department_id'],
    manager: ['manager_id'],
    job: ['job_id'],
    company: ['company_id']
  }
});

export const AppSchema = new Schema({
  hr_employees
});

// For types
export type Database = (typeof AppSchema)['types'];
export type EmployeeRecord = Database['hr_employees'];