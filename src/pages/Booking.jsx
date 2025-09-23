import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Users, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react'
import { useHotels } from '../contexts/HotelContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Booking = () => {
  const { hotelId, roomId } = useParams()
  const navigate = useNavigate()
  const { getHotelById, getRoomById, createBooking } = useHotels()
  const { user } = useAuth()
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    mealType: '',
    specialRequests: '',
    paymentMethod: '',
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const hotel = getHotelById(hotelId)
  const room = getRoomById(hotelId, roomId)

  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        guestInfo: {
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: ''
        }
      }))
    }
  }, [user])

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const diffTime = Math.abs(checkOut - checkIn)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const roomTotal = room.price * nights
    const taxes = roomTotal * 0.12 // 12% tax
    return {
      roomTotal,
      taxes,
      total: roomTotal + taxes
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to make a booking')
      navigate('/login')
      return
    }


    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    if (!bookingData.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsSubmitting(true)

    try {
      const booking = createBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomId: room.id,
        roomType: room.type,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        guestInfo: bookingData.guestInfo,
        specialRequests: bookingData.specialRequests,
        totalAmount: calculateTotal().total,
        status: 'confirmed'
      })

      toast.success('Booking confirmed!')
      setShowConfirmation(true)
    } catch (error) {
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your reservation has been successfully created. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totals = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/hotel/${hotelId}`)}
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hotel</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dates and Guests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    value={bookingData.mealType}
                    onChange={(e) => setBookingData({...bookingData, mealType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select meal type</option>
                    <option value="South Indian">South Indian</option>
                    <option value="North Indian">North Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                {/* Guest Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.guestInfo.firstName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          guestInfo: {...bookingData.guestInfo, firstName: e.target.value}
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.guestInfo.lastName}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          guestInfo: {...bookingData.guestInfo, lastName: e.target.value}
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={bookingData.guestInfo.email}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          guestInfo: {...bookingData.guestInfo, email: e.target.value}
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={bookingData.guestInfo.phone}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          guestInfo: {...bookingData.guestInfo, phone: e.target.value}
                        })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>


                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash"
                        checked={bookingData.paymentMethod === 'Cash'}
                        onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                      />
                      Cash
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={bookingData.paymentMethod === 'Card'}
                        onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                      />
                      Card
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online UPI"
                        checked={bookingData.paymentMethod === 'Online UPI'}
                        onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                      />
                      Online UPI
                    </label>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows={4}
                    className="input-field"
                    placeholder="Any special requests or notes for your stay..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{hotel.name}</h4>
                  <p className="text-sm text-gray-600">{room.type}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Room rate (×{calculateNights()} nights)</span>
                    <span>${totals.roomTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Taxes and fees</span>
                    <span>${totals.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
