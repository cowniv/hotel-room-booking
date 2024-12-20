# Hotel Room Booking

A browser-based adaptation of my Computer Drafting and Design flowchart, *Hotel Room Booking System*.

## Provenance

The original Flowgorithm source was created on September 19, 2025. It asks for a room type, guest count, and stay duration; validates the selected room's capacity; and calculates `totalFee = feePerDay * days`.

The web adaptation was added later. It keeps the original room rates and capacity rules while expanding the exercise into an interactive booking form.

## Features

- Three room types with the flowchart's rates and guest limits
- Check-in and check-out date pickers with automatic night counting
- Breakfast, parking, and spa add-ons
- Live booking summary and total
- Validation for dates, capacity, duplicate bookings, name, and email
- A locally saved booking list with cancellation support

## Run locally

Open `index.html` in a browser or serve the directory with a static file server.

## What I practiced

- Translating flowchart decisions and formulas into JavaScript functions
- Working with dates and overlapping booking ranges
- Event delegation for room cards and cancellation controls
- Persisting browser state with `localStorage`
- Applying array methods such as `filter`, `reduce`, `some`, and `map`
