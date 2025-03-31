export const AI_PROMPT = `
Generate a detailed travel plan in JSON format for a trip to {location} lasting {totalDay} days and {totalNight} nights for {travelers} travelers, with a {budget} budget. The traveler type is {traveler}. The plan should include:

1. **Hotel Options**: Each hotel entry should contain:
   - Hotel name
   - Address
   - Price per night
   - Image URL
   - Geo coordinates
   - Rating
   - Brief description.

2. **Nearby Places to Visit**: Each place should include:
   - Place name
   - Address
   - Ticket price (e.g., "₹500")
   - Description (including suggested activities)
   - Place image URL
   - Geo coordinates
   - Best time to visit
   - Estimated travel time from the hotel.

3. **Itinerary**: For each day of the trip, provide a detailed itinerary that includes:
   - **Time of Visit**: Indicating the time of day.
   - **Activity**: Detailed descriptions of what the traveler should do during that time.
   - **Place Details**: Include place name, description, ticket pricing (e.g., "₹500"), and estimated travel time from the hotel.
   - **Suggested Activities**: Mention activities to do during the visit (e.g., sightseeing, shopping, camel riding).
   - **Best Time to Visit**: Indicate the ideal time (morning, afternoon, evening).
   - **Transportation**: Specify how to travel between locations using {transportation} and provide estimated journey times.

The budget should be optimized for {travelers} travelers and ensure the activities and accommodation options are within the {budget} limit.

{transportation_details}
`;
