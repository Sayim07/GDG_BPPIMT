# Attendees & Certificate Roster Configuration

This directory contains `attendees.json`, which powers the **Event Certificate Verification & Download Portal** (`/certificate`).

## How it Works with Bevy Export

1. When the event concludes, download the **Attendees / Check-in CSV or Excel file** from the official Bevy GDG Dashboard (`gdg.community.dev`).
2. Each verified student who attended the event will have their row in `attendees.json`:
```json
[
  {
    "id": "GDG-BPPIMT-2026-001",
    "name": "Full Name",
    "email": "student@gmail.com",
    "attended": true,
    "eventId": "gdg-bppimt-mc349m",
    "eventName": "GDG On Campus BPPIMT — Featured Event & Workshop",
    "eventDate": "November 25, 2026",
    "issuedAt": "November 27, 2026"
  }
]
```
3. Whenever the user provides the Excel/CSV file, simply share it with the assistant or drop it in `src/data/`—the assistant will format and populate `attendees.json` instantly.
4. Students can immediately enter their email on `/certificate` and download their high-resolution certificate.
