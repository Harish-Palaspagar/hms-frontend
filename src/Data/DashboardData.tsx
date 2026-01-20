const data = [
    { date: 'Jan 2025', appointments:54},
    { date: 'Feb 2025', appointments:67},
    { date: 'Mar 2025', appointments:89},
    { date: 'Apr 2025', appointments:120},
    { date: 'May 2025', appointments:145},
    { date: 'Jun 2025', appointments:170},
    { date: 'Jul 2025', appointments:200},
    { date: 'Aug 2025', appointments:220},
    { date: 'Sep 2025', appointments:240},
    { date: 'Oct 2025', appointments:260},
    { date: 'Nov 2025', appointments:280},
    { date: 'Dec 2025', appointments:300},
];

const doctorData = [
    { date: 'Jan 2025', doctors:14},
    { date: 'Feb 2025', doctors:17},
    { date: 'Mar 2025', doctors:19},
    { date: 'Apr 2025', doctors:20},
    { date: 'May 2025', doctors:22},
    { date: 'Jun 2025', doctors:25},
    { date: 'Jul 2025', doctors:27},
    { date: 'Aug 2025', doctors:30},
    { date: 'Sep 2025', doctors:32},
    { date: 'Oct 2025', doctors:35},
    { date: 'Nov 2025', doctors:37},
    { date: 'Dec 2025', doctors:40},
];

const patientData = [   
    { date: 'Jan 2025', patients:34},
    { date: 'Feb 2025', patients:47},
    { date: 'Mar 2025', patients:59},
    { date: 'Apr 2025', patients:80},
    { date: 'May 2025', patients:95},
    { date: 'Jun 2025', patients:110},
    { date: 'Jul 2025', patients:130},
    { date: 'Aug 2025', patients:150},
    { date: 'Sep 2025', patients:170},
    { date: 'Oct 2025', patients:190},
    { date: 'Nov 2025', patients:210},
    { date: 'Dec 2025', patients:230},
];

const diseaseData = [
  { name: 'Diabetes', value: 285, color: 'blue.6' },
  { name: 'Hypertension', value: 340, color: 'red.6' },
  { name: 'Asthma', value: 156, color: 'cyan.6' },
  { name: 'Heart Disease', value: 198, color: 'pink.6' },
  { name: 'Arthritis', value: 124, color: 'orange.6' },
  { name: 'Respiratory', value: 167, color: 'teal.6' },
  { name: 'Others', value: 230, color: 'gray.6' },
];

const appointments = [
  { time: '09:00 AM', patient: 'Alice Cooper', doctor: 'Dr. Smith', reason: 'Checkup' },
  { time: '10:30 AM', patient: 'Bob Martin', doctor: 'Dr. Jones', reason: 'Follow-up' },
  { time: '11:00 AM', patient: 'Carol White', doctor: 'Dr. Smith', reason: 'Consultation' },
  { time: '02:00 PM', patient: 'David Lee', doctor: 'Dr. Brown', reason: 'Surgery' },
  { time: '03:30 PM', patient: 'Emma Davis', doctor: 'Dr. Jones', reason: 'Checkup' },
];

const medicines = [
  { name: 'Paracetamol', stock: 450, manufacturer: 'Pfizer' },
  { name: 'Amoxicillin', stock: 230, manufacturer: 'GSK' },
  { name: 'Ibuprofen', stock: 380, manufacturer: 'Johnson & Johnson' },
  { name: 'Metformin', stock: 520, manufacturer: 'Novartis' },
  { name: 'Aspirin', stock: 290, manufacturer: 'Bayer' },
  { name: 'Omeprazole', stock: 165, manufacturer: 'AstraZeneca' },
  { name: 'Atorvastatin', stock: 340, manufacturer: 'Pfizer' },
  { name: 'Lisinopril', stock: 210, manufacturer: 'Merck' },
  { name: 'Amlodipine', stock: 185, manufacturer: 'Novartis' },
  { name: 'Levothyroxine', stock: 275, manufacturer: 'Abbott' },
];

const patients = [
  { name: 'John Anderson', age: 45, bloodGroup: 'O+', location: 'New York' },
  { name: 'Sarah Mitchell', age: 32, bloodGroup: 'A+', location: 'Los Angeles' },
  { name: 'Michael Chen', age: 58, bloodGroup: 'B+', location: 'Chicago' },
  { name: 'Emily Rodriguez', age: 41, bloodGroup: 'AB+', location: 'Houston' },
  { name: 'David Thompson', age: 67, bloodGroup: 'O-', location: 'Phoenix' },
  { name: 'Jessica Williams', age: 29, bloodGroup: 'A-', location: 'Philadelphia' },
  { name: 'Robert Brown', age: 53, bloodGroup: 'B-', location: 'San Antonio' },
  { name: 'Maria Garcia', age: 38, bloodGroup: 'AB-', location: 'San Diego' },
  { name: 'James Wilson', age: 62, bloodGroup: 'O+', location: 'Dallas' },
  { name: 'Linda Martinez', age: 47, bloodGroup: 'A+', location: 'San Jose' },
];

const doctors = [
  { name: 'Dr. Sarah Smith', email: 'sarah.smith@hospital.com', department: 'Cardiology', location: 'Building A, Floor 3' },
  { name: 'Dr. Michael Johnson', email: 'michael.j@hospital.com', department: 'Neurology', location: 'Building B, Floor 2' },
  { name: 'Dr. Emily Davis', email: 'emily.davis@hospital.com', department: 'Pediatrics', location: 'Building C, Floor 1' },
  { name: 'Dr. James Wilson', email: 'james.wilson@hospital.com', department: 'Orthopedics', location: 'Building A, Floor 2' },
  { name: 'Dr. Lisa Anderson', email: 'lisa.anderson@hospital.com', department: 'Dermatology', location: 'Building D, Floor 4' },
  { name: 'Dr. Robert Brown', email: 'robert.brown@hospital.com', department: 'Surgery', location: 'Building B, Floor 5' },
  { name: 'Dr. Jennifer Lee', email: 'jennifer.lee@hospital.com', department: 'Psychiatry', location: 'Building C, Floor 3' },
  { name: 'Dr. David Martinez', email: 'david.m@hospital.com', department: 'Internal Medicine', location: 'Building A, Floor 1' },
  { name: 'Dr. Amanda Taylor', email: 'amanda.taylor@hospital.com', department: 'Oncology', location: 'Building D, Floor 2' },
  { name: 'Dr. Christopher White', email: 'chris.white@hospital.com', department: 'Emergency Medicine', location: 'Building E, Ground Floor' },
];

const patientMedications = [
  { name: "Paracetamol", dosage: "500 mg", freq: "2× daily", manufacturer: "Pier" },
  { name: "Metformin", dosage: "500 mg", freq: "1× daily", manufacturer: "Novartis" },
  { name: "Amlodipine", dosage: "5 mg", freq: "1× daily", manufacturer: "Novartis" },
  { name: "Amlodipine", dosage: "5 mg", freq: "1× daily", manufacturer: "Novartis" },
  { name: "Amlodipine", dosage: "5 mg", freq: "1× daily", manufacturer: "Novartis" },
];






export {data, doctorData, patientData, diseaseData, appointments, medicines, patients, doctors, patientMedications};