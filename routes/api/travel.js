const express = require('express');
const router = express.Router();
const Travel = require('../../models/Travel');
const config = require('config');
const { check, validationResult } = require('express-validator');

router.post(
  '/createTravelRecord',
  [
    check('Destination').not().isEmpty(),
    check('Year').not().isEmpty(),
    check('TravelDate').not().isEmpty(),
    check('Airline').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(500)
        .json({
          message:
            'Failed to add a travel record, missing required field information.',
        });
    }

    const {
      Destination,
      Year,
      TravelDate,
      Airline,
      Hotel,
      BookingCode,
      APCode,
      ItineraryFlght,
      ItineraryHotel,
      Status,
      FlightCost,
      HotelCost,
      GirlCost,
      TotalCost,
      Rating,
      Notes,
    } = req.body;

    let existingRecord;
    try {
      existingUser = await Travel.findOne({ BookingCode: BookingCode });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Issue verifying if Travel Record exists' });
    }

    if (existingUser) {
      return res
        .status(500)
        .json({ message: 'Travel Record exists already..' });
    }

    const createdTravel = new Travel({
      Destination,
      Year,
      TravelDate,
      Airline,
      Hotel,
      BookingCode,
      APCode,
      ItineraryFlght,
      ItineraryHotel,
      Status,
      FlightCost,
      HotelCost,
      GirlCost,
      TotalCost,
      Rating,
      Notes,
    });

    await createdTravel
      .save()
      .then(() => {
        res
          .status(201)
          .json({ travel: createdTravel.toObject({ getters: true }) });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({
            message: 'Failed add up travel record. please try again: -' + error,
          });
      });

    res.status(201);
  }
);

router.post('/searchTravelRecord', async (req, res) => {
  const { All, BookingCode, Airline, APCode, Year, Status, SearchType } =
    req.body;

  let clientRecord;

  switch (SearchType) {
    case 'All':
      try {
        travelRecord = await Travel.find();
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    case 'BookingCode':
      try {
        travelRecord = await Travel.findOne({ BookingCode: BookingCode });
        return res
          .status(200)
          .json({ travel: travelRecord.toObject({ getters: true }) });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    case 'Airline':
      try {
        travelRecord = await Travel.find({ Airline: Airline });
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' + error });
      }
      break;
    case 'APCode':
      try {
        travelRecord = await Travel.find({ APCode: APCode });
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    case 'Status':
      try {
        travelRecord = await Travel.find({ Status: Status });
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    case 'Year':
      try {
        travelRecord = await Travel.find({ Year: Year });
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    case 'Status':
      try {
        travelRecord = await Travel.find({ Status: Status });
        return res.status(200).json({ travel: travelRecord });
      } catch (error) {
        return res
          .status(500)
          .json({ message: 'No Records returned for your search' });
      }
      break;
    default:
      return res
        .status(500)
        .json({ message: 'No Records returned for your search' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }
    res.json(travel);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }
    res.status(500).send('Server error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }
    await travel.remove();
    res.json({ msg: 'Travel Record removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }

    const {
      Destination,
      Year,
      TravelDate,
      Airline,
      Hotel,
      BookingCode,
      APCode,
      ItineraryFlght,
      ItineraryHotel,
      Status,
      FlightCost,
      HotelCost,
      GirlCost,
      TotalCost,
      Rating,
      Notes,
    } = req.body;

    const updatedTravelRecord = {
      Destination,
      Year,
      TravelDate,
      Airline,
      Hotel,
      BookingCode,
      APCode,
      ItineraryFlght,
      ItineraryHotel,
      Status,
      FlightCost,
      HotelCost,
      GirlCost,
      TotalCost,
      Rating,
      Notes,
    };

    Object.assign(travel, updatedTravelRecord);
    await travel.save();
    return res.json({ msg: 'Travel Record Information Updated' });
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Travel Record not found' });
    }
    res.status(500).send('Server error');
  }
});
module.exports = router;
