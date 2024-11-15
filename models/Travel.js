const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
    Destination:{ type: String, required: true},
    Year:{ type: String},
    TravelDate:{ type: String, required: true},
    Airline:{ type: String, required: true},
    Hotel:{ type: String},
    BookingCode:{ type: String},
    APCode:{ type: String},
    ItineraryFlght:{ type: String},
    ItineraryHotel:{ type: String},
    Status:{ type: String},
    FlightCost:{ type: Number},
    HotelCost:{ type: Number},
    GirlCost:{ type: Number},
    TotalCost:{ type: Number},
    Rating:{ type: String},
    Notes:{ type: String}
});

travelSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Travel',travelSchema);