import hotelExterior from './assets/images/hotel-exterior.jpg';
import standardRoom from './assets/images/standard-room.jpg';
import deluxeRoom from './assets/images/deluxe-room.jpg';
import suiteRoom from './assets/images/suite-room.jpg';

export default function App() {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-image">
        <img
          src={hotelExterior}
          alt="Luxury Hotel Exterior"
          className="hotel-image w-full h-auto object-cover rounded-xl"
        />
      </div>

      {/* Room Type Cards */}
      <div className="room-types grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="room-card">
          <img
            src={standardRoom}
            alt="Standard Room Interior"
            className="room-image w-full h-64 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">Standard Room</h3>
        </div>
        <div className="room-card">
          <img
            src={deluxeRoom}
            alt="Deluxe Room Interior"
            className="room-image w-full h-64 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">Deluxe Room</h3>
        </div>
        <div className="room-card">
          <img
            src={suiteRoom}
            alt="Suite Room Interior"
            className="room-image w-full h-64 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-bold text-lg">Suite Room</h3>
        </div>
      </div>
    </div>
  );
}