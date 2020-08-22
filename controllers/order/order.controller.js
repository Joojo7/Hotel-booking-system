const OrderHelper = require('../../helpers/order.helper');
const HotelHelper = require('../../helpers/hotel.helper');
const RoomHelper = require('../../helpers/room.helper');
const PaymentHelper = require('../../helpers/payment.helper');
const omit = require('lodash/omit');
const {
  HOTEL_NOT_FOUND,
  ROOM_NOT_FOUND,
  ROOM_CAPACITY_EXCEEDED,
  PAYMENT_ERROR
} = require("../../errorDefinition/errors.map");
class order {
    static async createOrder(req, res) {
        try {
            const body = req.body

            const hotel = await HotelHelper.getHotel(body.hotel_id ? body.hotel_id  : "")
            if (!hotel) {
                throw HOTEL_NOT_FOUND
            }

            const room = await RoomHelper.getRoom(body.room_id ? body.room_id  : "")
            if (!room) {
                throw ROOM_NOT_FOUND
            }

            
            if (body.number_of_guests > room.room_capacity) {
                throw ROOM_CAPACITY_EXCEEDED
            }

            await OrderHelper.validateDates(body.check_in_date , body.check_out_date)

            const paymentObj = {
                status: "pending",
                method: "CREDIT_CARD",
                description: `Hotel: ${hotel.hotel_name}, Room: ${room.room_name}, Number of Guests: ${body.number_of_guests}, price: ${room.price}`,
                total_amount: room.price,
                credit_card: body.credit_card
            }


            const payment = await PaymentHelper.create(paymentObj);

            if (!payment) {
                throw PAYMENT_ERROR
            }

            body.payment_id = payment.payment_id
            const order = await OrderHelper.create(body);

            const bookingObject = {
                hotel_name : hotel.hotel_name,
                room_name : room.room_name,
                number_of_guests: body.number_of_guests,
                total_amount: room.price,
                name: order.name,
                email: order.email,
                phone: order.phone
            }


            res.sendSuccess(bookingObject);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }

    static async createHotel(req, res) {
        try {

            const hotel = await HotelHelper.create(req.body);


            res.sendSuccess(hotel);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }

    static async createRoom(req, res) {
        try {

            const hotel = await RoomHelper.create(req.body);


            res.sendSuccess(hotel);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }


    static async getOrders(req, res) {
        try {
            const options = {
                sort: req.query.sort,
                order: req.query.order,
                page: req.query.page,
                recordPerPage: req.query.pageSize,
                filterHotel: req.query.filterHotel,
                filterUser: req.query.filterUser,
                fromDateCreated: req.query.fromDateCreated,
                toDateCreated: req.query.toDateCreated,
                fromDateCheckIn: req.query.fromDateCheckIn,
                toDateCheckIn: req.query.toDateCheckIn,
                fromDateCheckOut: req.query.fromDateCheckOut,
                toDateCheckOut: req.query.toDateCheckOut
            };

            const Orders = await OrderHelper.getOrders(options);

            res.sendSuccess(Orders);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async getHotels(req, res) {
        try {
            const options = {
                sort: req.query.sort,
                order: req.query.order,
                page: req.query.page,
                recordPerPage: req.query.pageSize,
                filter: req.query.filter,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate
            };

            const Orders = await HotelHelper.getHotels(options);

            res.sendSuccess(Orders);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async update(req, res) {
        try {
            const parameters = {
                order_id: req.params.id,
                order: req.body
            };
            const orderupdate = await OrderHelper.update(parameters);

            res.sendSuccess({orderupdate});
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }

    static async show(req, res) {
        try {
            const order = await OrderHelper.getOrder(req.params.id);
            if (!order){
                throw EVENT_OR_NEWS_NOT_FOUND;
            }

            res.sendSuccess(order);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async delete(req, res) {
        try {
            const order = await OrderHelper.delete(req.params.id);

            res.sendSuccess(order);
        } catch (error) {
            console.log(error);
            res.sendError(error, res.header('languageId'),null,error);
        }
    }
}

module.exports = order;