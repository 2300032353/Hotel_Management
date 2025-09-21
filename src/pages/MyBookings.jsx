import { useState } from 'react'
import { Calendar, MapPin, Users, CreditCard, Eye, X } from 'lucide-react'
import { useHotels } from '../contexts/HotelContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const { bookings, cancelBooking } = useHotels()
  const { user } = useAuth()
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Filter bookings for current user
  const userBookings = bookings.filter(booking => 
    booking.guestInfo?.email === user?.email
  )

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (userBookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring our hotels!
            </p>
            <a
              href="/search"
              className="btn-primary"
            >
              Search Hotels
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your hotel reservations and view booking details
          </p>
        </div>

        <div className="space-y-6">
          {userBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {booking.hotelName}
                        </h3>
                        <p className="text-gray-600">{booking.roomType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">Check-in</div>
                          <div className="text-sm">{formatDate(booking.checkIn)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">Check-out</div>
                          <div className="text-sm">{formatDate(booking.checkOut)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <div>
                          <div className="text-sm font-medium">Guests</div>
                          <div className="text-sm">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Special Requests:</div>
                        <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary-600">
                        ${booking.totalAmount}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn-secondary text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn-outline text-sm text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedBooking.hotelName}
                  </h3>
                  <p className="text-gray-600">{selectedBooking.roomType}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Check-in Details</h4>
                    <p className="text-gray-600">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Check-out Details</h4>
                    <p className="text-gray-600">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Number of Guests</h4>
                    <p className="text-gray-600">{selectedBooking.guests} guest{selectedBooking.guests > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Booking Status</h4>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">
                      {selectedBooking.guestInfo?.firstName} {selectedBooking.guestInfo?.lastName}
                    </p>
                    <p className="text-gray-600">{selectedBooking.guestInfo?.email}</p>
                    <p className="text-gray-600">{selectedBooking.guestInfo?.phone}</p>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                    <p className="text-gray-600">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${selectedBooking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id)
                      setSelectedBooking(null)
                    }}
                    className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
