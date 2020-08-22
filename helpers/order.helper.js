
const ordersModel = require('../models/order/order.model');



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
        toDateCheckOut
    }) {
        try {
            sort = sort || 'updated_at';
            order = order || 'desc';
            filter = filter || '';
            page = page || 1;
            recordPerPage = parseInt(recordPerPage) || 10;
            const startIndex = (page - 1) * recordPerPage;

            let matchQuery = {
              deleted: false
            };



            let query = ordersModel.aggregate().match(matchQuery)
            .lookup({
                from: 'hotel',
                localField: 'hotel_id',
                foreignField: 'hotel_id',
                as: 'hotel'
            })
            .lookup({
                from: 'room',
                localField: 'room_id',
                foreignField: 'room_id',
                as: 'room'
            })
            .lookup({
                from: 'payment',
                localField: 'payment_id',
                foreignField: 'payment_id',
                as: 'payment'
            })
            .lookup({
                from: 'user_information',
                localField: 'uid',
                foreignField: 'uid',
                as: 'user'
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
                            "user.username": {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        },
                        {
                            "user.email": {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            "user.phone": {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            "user.uid": {
                                $regex: filter,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                order_id: 1,
                hotel: 1,
                room: 1,
                payment: 1,
                number_of_guests: 1,
                user: 1,
                check_in_date: 1,
                check_out_date: 1,
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
        })
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
