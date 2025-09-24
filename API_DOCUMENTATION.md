# PrescribeNow API Documentation

## Overview

PrescribeNow is a healthcare prescription management system built with Next.js and TypeScript. This API provides endpoints for managing prescriptions, appointments, patients, and pharmacies.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

Currently, the API does not require authentication. In a production environment, consider implementing authentication and authorization.

## Data Storage

The API uses Upstash Redis for data persistence. Data is stored as JSON strings with the following keys:
- `prescriptions`: Array of prescription objects
- `appointments`: Array of appointment objects
- `patients`: Array of patient objects
- `pharmacies`: Array of pharmacy objects

## API Endpoints

### Prescriptions

#### GET /api/prescriptions

Retrieve all prescriptions with optional filtering.

**Query Parameters:**
- `patientId` (string): Filter by patient ID
- `status` (string): Filter by prescription status

**Response:**
```json
[
  {
    "id": "string",
    "patientId": "string",
    "patientName": "string",
    "medicationId": "string",
    "medication": "string",
    "dosage": "string",
    "quantity": 30,
    "refills": 0,
    "instructions": "string",
    "prescribedDate": "2024-01-15T10:30:00.000Z",
    "status": "pending",
    "pharmacyId": "string",
    "pharmacy": "string",
    "deliveryOption": "pickup",
    "deliveryAddress": "string",
    "estimatedReady": "2:30 PM",
    "notes": "string"
  }
]
```

#### POST /api/prescriptions

Create a new prescription.

**Request Body:**
```json
{
  "patientId": "string",
  "patientName": "string",
  "medicationId": "string",
  "medication": "string",
  "dosage": "string",
  "quantity": 30,
  "refills": 0,
  "instructions": "string",
  "pharmacyId": "string",
  "pharmacy": "string",
  "deliveryOption": "pickup",
  "deliveryAddress": "string",
  "notes": "string"
}
```

**Response:** Created prescription object

#### GET /api/prescriptions/[id]

Retrieve a specific prescription by ID.

**Response:** Prescription object

#### PUT /api/prescriptions/[id]

Update a prescription.

**Request Body:** Partial prescription object with fields to update

**Response:** Updated prescription object

#### DELETE /api/prescriptions/[id]

Delete a prescription.

**Response:** Success message

### Appointments

#### GET /api/appointments

Retrieve all appointments with optional filtering.

**Query Parameters:**
- `patientId` (string): Filter by patient ID
- `date` (string): Filter by date (YYYY-MM-DD)
- `status` (string): Filter by appointment status

**Response:**
```json
[
  {
    "id": "string",
    "patientId": "string",
    "patientName": "string",
    "date": "2024-01-15",
    "time": "14:30",
    "duration": 30,
    "type": "consultation",
    "status": "scheduled",
    "reason": "string",
    "notes": "string",
    "prescriptionIds": ["string"]
  }
]
```

#### POST /api/appointments

Create a new appointment.

**Request Body:**
```json
{
  "patientId": "string",
  "patientName": "string",
  "date": "2024-01-15",
  "time": "14:30",
  "duration": 30,
  "type": "consultation",
  "reason": "string",
  "notes": "string",
  "prescriptionIds": ["string"]
}
```

**Response:** Created appointment object

#### GET /api/appointments/[id]

Retrieve a specific appointment by ID.

**Response:** Appointment object

#### PUT /api/appointments/[id]

Update an appointment.

**Request Body:** Partial appointment object with fields to update

**Response:** Updated appointment object

#### DELETE /api/appointments/[id]

Delete an appointment.

**Response:** Success message

### Patients

#### GET /api/patients

Retrieve all patients with optional search.

**Query Parameters:**
- `search` (string): Search term for name, email, or phone

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "(555) 123-4567",
    "dateOfBirth": "1990-01-15",
    "address": "string",
    "insuranceProvider": "string",
    "allergies": ["string"],
    "medicalHistory": ["string"]
  }
]
```

#### POST /api/patients

Create a new patient.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "1990-01-15",
  "address": "string",
  "insuranceProvider": "string",
  "allergies": ["string"],
  "medicalHistory": ["string"]
}
```

**Response:** Created patient object

#### GET /api/patients/[id]

Retrieve a specific patient by ID.

**Response:** Patient object

#### PUT /api/patients/[id]

Update a patient.

**Request Body:** Partial patient object with fields to update

**Response:** Updated patient object

#### DELETE /api/patients/[id]

Delete a patient.

**Response:** Success message

### Pharmacies

#### GET /api/pharmacies

Retrieve all pharmacies.

**Query Parameters:**
- `deliveryOnly` (boolean): Filter to only show pharmacies with delivery available

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "hours": "string",
    "deliveryAvailable": true,
    "estimatedFillTime": 30,
    "rating": 4.5,
    "distance": 2.3
  }
]
```

#### POST /api/pharmacies

Add a new pharmacy (admin functionality).

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "hours": "string",
  "deliveryAvailable": true,
  "estimatedFillTime": 30,
  "rating": 4.5,
  "distance": 2.3
}
```

**Response:** Created pharmacy object

## Data Types

### Prescription Statuses
- `pending`: Prescription submitted, waiting to be filled
- `filled`: Pharmacy has prepared the medication
- `ready`: Ready for pickup or delivery
- `delivered`: Successfully delivered or picked up
- `cancelled`: Prescription cancelled

### Appointment Types
- `consultation`: General consultation
- `follow-up`: Follow-up visit
- `check-up`: Routine check-up
- `urgent`: Urgent care visit

### Appointment Statuses
- `scheduled`: Appointment is scheduled
- `confirmed`: Patient confirmed attendance
- `completed`: Appointment completed
- `cancelled`: Appointment cancelled
- `no-show`: Patient did not show up

### Medication Forms
- `tablet`: Solid oral dosage form
- `capsule`: Solid oral dosage form in capsule
- `liquid`: Liquid oral dosage form
- `injection`: Injectable form
- `cream`: Topical cream
- `inhaler`: Inhalation device

### Delivery Options
- `pickup`: Patient will pick up at pharmacy
- `delivery`: Medication will be delivered

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (e.g., duplicate email)
- `500`: Internal Server Error

Error responses include a JSON object with an `error` field:

```json
{
  "error": "Error message description"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production.

## Data Validation

All endpoints perform input validation:

- Required fields are checked
- Email format validation
- Phone number format validation
- Date validation
- Numeric range validation

## Future Enhancements

- Authentication and authorization
- Rate limiting
- API versioning
- Pagination for large datasets
- Advanced filtering and sorting
- Real-time notifications via WebSockets
- Integration with external pharmacy APIs
- Audit logging
- Data encryption for sensitive information

