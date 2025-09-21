import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, MapPin, Filter, SlidersHorizontal } from 'lucide-react'
import { useHotels } from '../contexts/HotelContext'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests')) || 1,
    rooms: parseInt(searchParams.get('rooms')) || 1,
    minPrice: '',
    maxPrice: '',
    rating: '',
    amenities: []
  })
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('price')
  const { hotels, searchHotels } = useHotels()
  const [filteredHotels, setFilteredHotels] = useState([])

  useEffect(() => {
    const results = searchHotels(filters)
    setFilteredHotels(results)
  }, [filters, hotels])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const sortHotels = (hotels) => {
    return [...hotels].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }

  const availableAmenities = ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Beach Access', 'Mountain Views']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              {filteredHotels.length} hotels found
              {filters.location && ` in ${filters.location}`}
            </p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="space-y-2">
                  {availableAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setFilters({
                    location: '',
                    checkIn: '',
                    checkOut: '',
                    guests: 1,
                    rooms: 1,
                    minPrice: '',
                    maxPrice: '',
                    rating: '',
                    amenities: []
                  })
                }}
                className="w-full btn-outline"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Hotels List */}
          <div className="flex-1">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hotels found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortHotels(filteredHotels).map((hotel) => (
                  <div key={hotel.id} className="card-hover">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-80 h-64 md:h-auto">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {hotel.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 bg-white rounded-full px-3 py-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{hotel.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {hotel.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{hotel.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-primary-600">
                              ${hotel.price}
                              <span className="text-sm font-normal text-gray-500">/night</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {hotel.rooms.length} room types available
                            </div>
                          </div>
                          <Link
                            to={`/hotel/${hotel.id}`}
                            className="btn-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
