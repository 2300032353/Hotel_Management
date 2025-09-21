import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Wifi, Car, Utensils, Dumbbell, Waves, Users, Square, Calendar, ArrowLeft } from 'lucide-react'
import { useHotels } from '../contexts/HotelContext'

const HotelDetails = () => {
  const { id } = useParams()
  const { getHotelById } = useHotels()
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const hotel = getHotelById(id)

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h2>
          <Link to="/search" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const handleBookRoom = (room) => {
    setSelectedRoom(room)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/search"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search</span>
        </Link>

        {/* Hotel Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{hotel.location}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white rounded-full px-3 py-1 border">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {hotel.description}
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  ${hotel.price}
                  <span className="text-lg font-normal text-gray-500">/night</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Starting from
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <img
                src={hotel.images[selectedImage]}
                alt={hotel.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {hotel.images.slice(0, 3).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hotel.amenities.map((amenity) => {
              const getIcon = (amenity) => {
                switch (amenity) {
                  case 'Free WiFi': return <Wifi className="h-6 w-6" />
                  case 'Parking': return <Car className="h-6 w-6" />
                  case 'Restaurant': return <Utensils className="h-6 w-6" />
                  case 'Gym': return <Dumbbell className="h-6 w-6" />
                  case 'Pool': return <Waves className="h-6 w-6" />
                  default: return <Star className="h-6 w-6" />
                }
              }
              
              return (
                <div key={amenity} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-primary-600">
                    {getIcon(amenity)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rooms</h2>
          <div className="space-y-6">
            {hotel.rooms.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {room.type}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{room.capacity} guest{room.capacity > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Square className="h-4 w-4" />
                            <span>{room.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          ${room.price}
                          <span className="text-sm font-normal text-gray-500">/night</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {room.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${room.type} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 lg:ml-8 lg:w-48">
                    <Link
                      to={`/booking/${hotel.id}/${room.id}`}
                      className="w-full btn-primary text-center block"
                    >
                      Book This Room
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetails
