# Hotel Images Directory

This directory contains all the images for the Hotel Booking Management System.

## Image Guidelines

### Recommended Image Sizes:
- **Hero Images**: 1200x600px (2:1 ratio)
- **Room Images**: 400x300px (4:3 ratio)
- **Feature Icons**: 100x100px (1:1 ratio)
- **Testimonial Avatars**: 100x100px (1:1 ratio)

### Image Formats:
- **JPEG**: For photographs (hotel exterior, rooms, amenities)
- **PNG**: For images with transparency (icons, logos)
- **WebP**: For optimized web delivery (recommended)

## How to Add Images:

1. **Add your images to this folder**
2. **Update the import statements in App.jsx**
3. **Replace the placeholder divs with actual img tags**

### Example:
```jsx
// Import the image
import hotelExterior from './assets/images/hotel-exterior.jpg'

// Use in component
<img src={hotelExterior} alt="Luxury Hotel Exterior" className="hotel-image" />
```

## Current Placeholders:
- `hotel-exterior.jpg` - Main hotel building image
- `standard-room.jpg` - Standard room interior
- `deluxe-room.jpg` - Deluxe room interior  
- `suite-room.jpg` - Suite room interior
- `spa.jpg` - Hotel spa facilities
- `restaurant.jpg` - Hotel restaurant
- `pool.jpg` - Hotel swimming pool
- `gym.jpg` - Hotel fitness center

## Image Optimization Tips:
- Compress images for web (aim for <200KB per image)
- Use descriptive alt text for accessibility
- Consider using responsive images with srcset
- Lazy load images below the fold for better performance
