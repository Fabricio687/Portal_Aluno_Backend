const Booking = require("../models/Booking");
const Spot = require("../models/Spots");

const store = async (req, res) => {
  const { user_id } = req.headers;
  const { spot_id } = req.params;
  const { date } = req.body;

  const booking = await Booking.create({
    user: user_id,
    spot: spot_id,
    date,
  });

  await booking.populate(["spot","user"]);

  return res.json(Booking);

};
const storeApprovals = async (req, res) => {
    const {booking_id} = req.params;

    const booking = await Booking.findByIdAndUpdate(booking_id, {approved: true});
    console.log(booking);

    //booking.approved = true;
    //await booking.save();
    await Booking.updateMany({_id: booking_id}, { $set: {approved: true}});

    return res.json(booking);


};


const storeRejections = async (req, res) => {
    
}
module.exports = { store, storeApprovals, storeRejections };

