import { createContext, useContext, useState } from 'react'

const HotelContext = createContext()

export const useHotels = () => {
  const context = useContext(HotelContext)
  if (!context) {
    throw new Error('useHotels must be used within a HotelProvider')
  }
  return context
}

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([
    {
      id: '1',
      name: 'Royal Palace Hotel',
      location: 'New York, NY',
      rating: 4.8,
      price: 299,
      image: '/src/assets/images/hotel-room-1.jpg',
      images: [
        '/src/assets/images/hotel-room-1.jpg'
      ],
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
      description: 'Experience luxury at its finest in the heart of Manhattan. Our premium hotel offers world-class amenities and breathtaking city views.',
      rooms: [
        {
          id: '1-1',
          type: 'Standard Room',
          price: 299,
          size: '25 sqm',
          capacity: 2,
          amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar'],
          images: ['/src/assets/images/hotel-room-1.jpg']
        },
        {
          id: '1-2',
          type: 'Deluxe Room',
          price: 399,
          size: '35 sqm',
          capacity: 2,
          amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar', 'Balcony'],
          images: ['/src/assets/images/hotel-room-2.jpg']
        },
        {
          id: '1-3',
          type: 'Suite',
          price: 599,
          size: '50 sqm',
          capacity: 4,
          amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar', 'Balcony', 'Living Area'],
          images: ['/src/assets/images/hotel-room-3.jpg']
        }
      ]
    },
    {
      id: '2',
      name: 'Grand Resort & Spa',
      location: 'Miami, FL',
      rating: 4.6,
      price: 249,
      image: '/src/assets/images/hotel-room-2.jpg',
      images: [
        '/src/assets/images/hotel-room-2.jpg',
      ],
      amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi'],
      description: 'Relax and unwind at our beachfront resort with stunning ocean views and world-class spa services.',
      rooms: [
        {
          id: '2-1',
          type: 'Ocean View Room',
          price: 249,
          size: '30 sqm',
          capacity: 2,
          amenities: ['Queen Bed', 'Ocean View', 'Free WiFi', 'Balcony'],
          images: ['/src/assets/images/hotel-room-2.jpg']
        },
        {
          id: '2-2',
          type: 'Beachfront Suite',
          price: 449,
          size: '45 sqm',
          capacity: 4,
          amenities: ['King Bed', 'Ocean View', 'Free WiFi', 'Private Balcony', 'Living Area'],
          images: ['/src/assets/images/hotel-room-4.jpg']
        }
      ]
    },
    {
      id: '3',
      name: 'Mountain View Lodge',
      location: 'Denver, CO',
      rating: 4.7,
      price: 199,
      image: '/src/assets/images/hotel-room-3.jpg',
      images: [
        '/src/assets/images/hotel-room-3.jpg',
      ],
      amenities: ['Mountain Views', 'Hiking Trails', 'Restaurant', 'Free WiFi', 'Parking'],
      description: 'Escape to the mountains and enjoy breathtaking views and outdoor adventures at our cozy lodge.',
      rooms: [
        {
          id: '3-1',
          type: 'Mountain View Room',
          price: 199,
          size: '28 sqm',
          capacity: 2,
          amenities: ['Queen Bed', 'Mountain View', 'Free WiFi', 'Fireplace'],
          images: ['/src/assets/images/hotel-room-3.jpg']
        },
        {
          id: '3-2',
          type: 'Family Suite',
          price: 349,
          size: '40 sqm',
          capacity: 4,
          amenities: ['Two Queen Beds', 'Mountain View', 'Free WiFi', 'Living Area'],
          images: ['/src/assets/images/hotel-room-1.jpg']
        }
      ]
    }
  ])

  const [bookings, setBookings] = useState([])
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  })

  const searchHotels = (filters) => {
    setSearchFilters(filters)
    // In a real app, this would make an API call
    if (!filters.location || filters.location.trim() === "") {
      return hotels;
    }
    const searchText = filters.location.toLowerCase().trim();
    const searchWords = searchText.split(/\s+/);
    return hotels.filter(hotel => {
      const hotelNameWords = hotel.name.toLowerCase().split(/\s+/);
      const hotelLocationWords = hotel.location.toLowerCase().split(/\s+/);
      // Match if ANY search word is contained within any word in name or location
      return searchWords.some(searchWord =>
        hotelNameWords.some(hotelWord => hotelWord.includes(searchWord)) ||
        hotelLocationWords.some(hotelWord => hotelWord.includes(searchWord))
      );
    });
  }

  const getHotelById = (id) => {
    return hotels.find(hotel => hotel.id === id)
  }

  const getRoomById = (hotelId, roomId) => {
    const hotel = getHotelById(hotelId)
    if (!hotel) return null
    return hotel.rooms.find(room => room.id === roomId)
  }

  const createBooking = (bookingData) => {
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    setBookings(prev => [...prev, newBooking])
    return newBooking
  }

  const updateBooking = (bookingId, updates) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, ...updates } : booking
    ))
  }

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    ))
  }

  const value = {
    hotels,
    bookings,
    searchFilters,
    searchHotels,
    getHotelById,
    getRoomById,
    createBooking,
    updateBooking,
    cancelBooking
  }

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  )
}
