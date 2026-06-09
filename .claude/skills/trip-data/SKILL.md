---
name: trip-data
description: Helps manage and modify the Japan trip itinerary data, including adding/editing activities, smoking spots, hotels, and updating costs.
---

# Trip Data Management Skill

This skill helps you work with the Japan Trip Planner itinerary data in `src/data/tripData.ts`.

## Data Structure

All trip data is in `src/data/tripData.ts`:

### Activity Structure
```typescript
{
  time: string;           // e.g., "9:00" or "9:00-11:00"
  title: string;          // Bulgarian title
  titleEn: string;        // English title
  transport?: string;     // Transport details with emoji (🚃🚇🚌🚶)
  notes?: string;         // Additional notes
  category: ActivityCategory; // 'flight' | 'transport' | 'sightseeing' | 'food' | 'hotel' | 'shopping' | 'walk' | 'smoking'
  costTransport?: number; // Transport cost in EUR
  costEntry?: string;     // Entry fee (can be string like "¥1,200" or number)
  costFood?: number;      // Food cost in EUR
  link?: string;          // External URL
  lat?: number;           // Latitude for map
  lng?: number;           // Longitude for map
}
```

### Smoking Spot Structure
```typescript
{
  name: string;      // Bulgarian name
  nameEn: string;    // English name
  lat: number;       // Latitude
  lng: number;       // Longitude
  notes?: string;    // Additional info
}
```

## Common Tasks

### Adding a New Activity
1. Read `src/data/tripData.ts`
2. Find the correct day in the `tripDays` array
3. Add the activity to the `activities` array in chronological order
4. Include both Bulgarian (`title`) and English (`titleEn`) versions
5. Add coordinates (`lat`, `lng`) if it should appear on the map
6. Use appropriate emoji for transport (🚃 JR, 🚇 Metro, 🚌 Bus, 🚶 Walking)

### Adding a Smoking Spot
1. Find the day in `tripDays`
2. Add to `smokingSpots` array with coordinates
3. Include both Bulgarian and English names

### Updating Costs
After modifying activity costs, update the `tripSummary` object:
- `totalTransport`: Sum of all `costTransport` values
- `totalEntry`: Sum of entry fees (convert ¥ to EUR)
- `totalFood`: Sum of all `costFood` values
- `totalHotel`: Sum of all hotel costs × nights
- `grandTotal`: Sum of all above

### Modifying Hotels
Hotels are per-day objects:
```typescript
hotel: {
  name: string;
  link: string;        // Booking.com URL
  costPerNight: number; // EUR per night
}
```

## Important Rules

1. **Always maintain dual language**: Every `title` needs a `titleEn`
2. **Time format**: Use 24-hour format (e.g., "14:30") or ranges ("9:00-11:00")
3. **Transport emoji**: 🚃 Shinkansen/JR, 🚇 Metro, 🚌 Bus, 🚶 Walking, ✈️ Flight
4. **Coordinates**: Use decimal degrees (e.g., 35.6812, 139.7671)
5. **Category consistency**: Use exact categories from ActivityCategory type
6. **Cost updates**: Always recalculate `tripSummary` when costs change

## Example: Adding a New Activity

```typescript
{
  time: '15:00',
  title: 'Храм Сенсо-джи',
  titleEn: 'Senso-ji Temple',
  transport: '🚇 Tokyo Metro Ginza Line • от Ueno → Asakusa • ~5 min',
  category: 'sightseeing',
  costTransport: 2,
  link: 'https://www.senso-ji.jp/english/',
  lat: 35.7148,
  lng: 139.7967,
  notes: 'Oldest temple in Tokyo'
}
```

## Workflow

When asked to modify trip data:
1. Read the current `tripData.ts` file
2. Make the requested changes
3. Update costs in `tripSummary` if needed
4. Verify the structure is valid TypeScript
5. Confirm changes with the user before saving
