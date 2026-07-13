# ShareBari Database Data Format

Frontend expects API responses wrapped in a `data` key.

## Item Document

Paste item data in MongoDB like this:

```json
{
  "slug": "bosch-drill-kit",
  "title": "Bosch Drill Kit",
  "shortDescription": "Cordless drill with bit set for quick home repairs.",
  "fullDescription": "A reliable drill kit for mounting shelves, assembling furniture, and weekend repair work.",
  "category": "tools-equipment",
  "dailyPrice": 450,
  "securityDeposit": 1500,
  "location": "Khulna",
  "condition": "excellent",
  "availability": "available",
  "brand": "Bosch",
  "model": "GSR 120-LI",
  "minimumRentalDays": 1,
  "images": [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80"
  ],
  "rating": 4.9,
  "featured": true,
  "owner": {
    "name": "Nusrat Jahan",
    "location": "Sonadanga, Khulna",
    "phone": "+8801711000001",
    "email": "nusrat@example.com"
  }
}
```

Allowed values:

```txt
category: tools-equipment | cameras-electronics | event-party | outdoor-sports | home-kitchen | books-learning
condition: like-new | excellent | good | fair
availability: available | rented | unavailable
```

## API Response Shapes

List items:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1,
    "totalPages": 1
  }
}
```

Single item:

```json
{
  "data": {}
}
```

Current user:

```json
{
  "data": {
    "_id": "user_id",
    "name": "ShareBari User",
    "email": "user@example.com",
    "phone": "+8801711000000",
    "location": "Dhaka",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

Dashboard stats:

```json
{
  "data": {
    "totalListedItems": 8,
    "availableItems": 6,
    "rentedItems": 1,
    "averageDailyPrice": 720,
    "byCategory": [
      { "_id": "tools-equipment", "count": 2 }
    ],
    "byAvailability": [
      { "_id": "available", "count": 6 }
    ]
  }
}
```
