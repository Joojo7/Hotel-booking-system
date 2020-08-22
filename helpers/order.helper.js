
const ordersModel = require('../models/order/order.model');
const {
    CHECK_IN_BEFORE_TODAY,
    CHECK_IN_BEFORE_CHECK_OUT,
    FILL_ALL_DATES
  } = require("../errorDefinition/errors.map");


class Order {


 //this is used to create a order
 static async create(order) {
    try {
        const result = await ordersModel.create(order);

        return result;
    } catch (error) {
        throw error;
    }
}

static async update({ order_id, order }) {
    try {
        const result = await ordersModel.findOneAndUpdate( 
            { order_id },
            { $set: order }, {new: true}
        );

    

        return result;
    } catch (error) {
        throw error;
    }
}

static async validateDates(checkInDate, checkOutDate) {
    try {

        if (!checkInDate || !checkOutDate) {
            throw FILL_ALL_DATES
        }

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const today = new Date()
       
        if (checkIn < today) {
            throw CHECK_IN_BEFORE_TODAY
        }

        if (checkIn > checkOut || checkIn === checkOut ) {
            throw CHECK_IN_BEFORE_CHECK_OUT
        }

    } catch (error) {
        throw error;
    }
}


    
    static async getOrders({
        sort,
        order,
        page,
        recordPerPage,
        filterHotel,
        filterUser,
        fromDateCreated,
        toDateCreated,
        fromDateCheckIn,
        toDateCheckIn,
        fromDateCheckOut,
        toDateCheckOut,
        matchQuery
    }) {
        try {
            sort = sort || 'updated_at';
            order = order || 'desc';
            filterHotel = filterHotel || ''
            filterUser = filterUser || ''
            page = page || 1;
            recordPerPage = parseInt(recordPerPage) || 10;
            const startIndex = (page - 1) * recordPerPage;

           matchQuery = matchQuery || {};



            let query = ordersModel.aggregate().match(matchQuery)
            .lookup({
                from: 'hotels',
                localField: 'hotel_id',
                foreignField: 'hotel_id',
                as: 'hotel'
            })
            .unwind({
                path: '$hotel',
                preserveNullAndEmptyArrays: true
            })
            .lookup({
                from: 'rooms',
                localField: 'room_id',
                foreignField: 'room_id',
                as: 'room'
            })
            .unwind({
                path: '$room',
                preserveNullAndEmptyArrays: true
            })
            .lookup({
                from: 'payments',
                localField: 'payment_id',
                foreignField: 'payment_id',
                as: 'payment'
            })
            .unwind({
                path: '$payment',
                preserveNullAndEmptyArrays: true
            })
            //filter for order creation
            if (fromDateCreated && toDateCreated) {
                query.match({
                    created_at: {
                        $lte: new Date(toDateCreated),
                        $gte: new Date(fromDateCreated)
                    }
                });
            }

            //filter for check in dates
            if (fromDateCheckIn && toDateCheckIn) {
                query.match({
                    check_in_date: {
                        $lte: new Date(toDateCheckIn),
                        $gte: new Date(fromDateCheckIn)
                    }
                });
            }

            //filter for check out dates
            if (fromDateCheckOut && toDateCheckOut) {
                query.match({
                    check_out_date: {
                        $lte: new Date(toDateCheckOut),
                        $gte: new Date(fromDateCheckOut)
                    }
                });
            }

            // filter for hotels
            if (filterHotel) {
                query.match({
                    "hotel.hotel_name": {
                        $regex: `${filterHotel}`,
                        $options: 'xi'
                    }
                });
            }

            if (filterUser) {
                query.match({
                    $or: [
                        {
                            name: {
                                $regex: `${filterUser}`,
                                $options: 'xi'
                            }
                        },
                        {
                            email: {
                                $regex: `${filterUser}`,
                                $options: 'xi'
                            }
                        },
                        {
                            phone: {
                                $regex: `${filterUser}`,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                order_id: 1,
                hotel_name: "$hotel.hotel_name",
                hotel_id: "$hotel.hotel_id",
                room_name: "$room.room_name",
                room_id: "$room.room_id",
                room_price: "$room.price",
                number_of_guests: 1,
                check_in_date: 1,
                check_out_date: 1,
                name : 1,
                email : 1,
                phone : 1,
                status : "$payment.status",
                payment_date : "$payment.payment_date",
                payment_description : "$payment.description",
                total_amount : "$payment.total_amount",
                payment_id : "$payment.payment_id",
                created_at: 1,
                updated_at: 1
        })

            // sort
            query
                .sort({
                    [sort]: order
                })

                .group({
                    _id: null,
                    total_count: {
                        $sum: 1
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                })

                //handle pagination
                .project({
                    total_count: true,
                    orders: {
                        $slice: ['$data', startIndex, recordPerPage]
                    }
                });
            
            let result = await query;
            

            if (!result[0]) {
                return result;
            }

            return result[0]
        } catch (error) {
            throw error;
        }
    }

    static async getOrder(id) {

        let result = await ordersModel.findOne({
            order_id: id
        }).populate('payment', '-_id status description total_amount payment_date')

        if (!result) {
            return null;
        }

        return result; 
    }


    static async delete(_id) {
        const order = await ordersModel.delete({_id});

        return order;
    }
}

module.exports = Order;
