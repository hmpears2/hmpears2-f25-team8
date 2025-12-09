package com.HomeConnectPro_hub.location;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * ============================================================================
 * Location Service - Google Maps Geocoding API Integration
 * ============================================================================
 * 
 * This service integrates with Google's Geocoding API to:
 * 1. Convert addresses to latitude/longitude coordinates
 * 2. Calculate distances between two locations
 * 3. Filter services by proximity to customer
 * 
 * 3rd Party API: Google Maps Geocoding API
 * Documentation: https://developers.google.com/maps/documentation/geocoding
 */
@Service
public class LocationService {

    @Value("${google.maps.api.key:}")
    private String googleApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    
    // Earth's radius in miles
    private static final double EARTH_RADIUS_MILES = 3958.8;

    public LocationService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Geocode an address to get latitude and longitude coordinates
     * Uses Google Maps Geocoding API
     * 
     * @param address The address to geocode
     * @return GeoLocation with lat/lng or null if not found
     */
    public GeoLocation geocodeAddress(String address) {
        try {
            // If no API key is configured, use fallback coordinates for demo
            if (googleApiKey == null || googleApiKey.isEmpty()) {
                return getFallbackCoordinates(address);
            }

            String url = UriComponentsBuilder.fromHttpUrl(GEOCODING_API_URL)
                    .queryParam("address", address)
                    .queryParam("key", googleApiKey)
                    .build()
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);

            String status = root.path("status").asText();
            if ("OK".equals(status)) {
                JsonNode location = root.path("results").get(0).path("geometry").path("location");
                double lat = location.path("lat").asDouble();
                double lng = location.path("lng").asDouble();
                
                String formattedAddress = root.path("results").get(0).path("formatted_address").asText();
                
                return new GeoLocation(lat, lng, formattedAddress);
            } else {
                System.err.println("Geocoding API returned status: " + status);
                return getFallbackCoordinates(address);
            }
        } catch (Exception e) {
            System.err.println("Error geocoding address: " + e.getMessage());
            return getFallbackCoordinates(address);
        }
    }

    /**
     * Calculate distance between two locations using Haversine formula
     * 
     * @param loc1 First location
     * @param loc2 Second location
     * @return Distance in miles
     */
    public double calculateDistance(GeoLocation loc1, GeoLocation loc2) {
        if (loc1 == null || loc2 == null) {
            return Double.MAX_VALUE;
        }

        double lat1 = Math.toRadians(loc1.getLatitude());
        double lat2 = Math.toRadians(loc2.getLatitude());
        double lng1 = Math.toRadians(loc1.getLongitude());
        double lng2 = Math.toRadians(loc2.getLongitude());

        // Haversine formula
        double dLat = lat2 - lat1;
        double dLng = lng2 - lng1;

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_MILES * c;
    }

    /**
     * Calculate distance between two addresses
     * 
     * @param address1 First address
     * @param address2 Second address
     * @return Distance in miles
     */
    public double calculateDistanceBetweenAddresses(String address1, String address2) {
        GeoLocation loc1 = geocodeAddress(address1);
        GeoLocation loc2 = geocodeAddress(address2);
        return calculateDistance(loc1, loc2);
    }

    /**
     * Check if a location is within a specified radius of another location
     * 
     * @param centerAddress The center point address
     * @param targetAddress The target address to check
     * @param radiusMiles The radius in miles
     * @return true if target is within radius
     */
    public boolean isWithinRadius(String centerAddress, String targetAddress, double radiusMiles) {
        double distance = calculateDistanceBetweenAddresses(centerAddress, targetAddress);
        return distance <= radiusMiles;
    }

    /**
     * Fallback coordinates for demo purposes when API key is not available
     * Uses approximate coordinates for common NC cities
     */
    private GeoLocation getFallbackCoordinates(String address) {
        String lowerAddress = address.toLowerCase();
        
        // Greensboro, NC area coordinates
        if (lowerAddress.contains("greensboro")) {
            return new GeoLocation(36.0726, -79.7920, address);
        }
        // High Point, NC
        else if (lowerAddress.contains("high point")) {
            return new GeoLocation(35.9557, -80.0053, address);
        }
        // Winston-Salem, NC
        else if (lowerAddress.contains("winston") || lowerAddress.contains("salem")) {
            return new GeoLocation(36.0999, -80.2442, address);
        }
        // Burlington, NC
        else if (lowerAddress.contains("burlington")) {
            return new GeoLocation(36.0957, -79.4378, address);
        }
        // Raleigh, NC
        else if (lowerAddress.contains("raleigh")) {
            return new GeoLocation(35.7796, -78.6382, address);
        }
        // Durham, NC
        else if (lowerAddress.contains("durham")) {
            return new GeoLocation(35.9940, -78.8986, address);
        }
        // Charlotte, NC
        else if (lowerAddress.contains("charlotte")) {
            return new GeoLocation(35.2271, -80.8431, address);
        }
        // Default to Greensboro center with slight random offset for variety
        else {
            double latOffset = (Math.random() - 0.5) * 0.1;
            double lngOffset = (Math.random() - 0.5) * 0.1;
            return new GeoLocation(36.0726 + latOffset, -79.7920 + lngOffset, address);
        }
    }

    /**
     * Inner class to represent geographic coordinates
     */
    public static class GeoLocation {
        private final double latitude;
        private final double longitude;
        private final String formattedAddress;

        public GeoLocation(double latitude, double longitude, String formattedAddress) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.formattedAddress = formattedAddress;
        }

        public double getLatitude() {
            return latitude;
        }

        public double getLongitude() {
            return longitude;
        }

        public String getFormattedAddress() {
            return formattedAddress;
        }

        @Override
        public String toString() {
            return String.format("GeoLocation[lat=%.6f, lng=%.6f, address=%s]", 
                    latitude, longitude, formattedAddress);
        }
    }
}