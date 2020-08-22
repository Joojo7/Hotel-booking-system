
const hotelsModel = require('../models/hotel/hotel.model');
const ObjectId = require('mongoose').Types.ObjectId;
const { INVALID_COORDS } = require('../errorDefinition/errors.map');
const isCoords = require('is-valid-coordinates');



class hotel {

 //   TODO: CREATE HOTEL HELPER

 //   TODO: UPDATE HOTEL HELPER


    
    static async gethotels({
        sort,
        order,
        page,
        recordPerPage,
        filter,
        fromDate,
        toDate,
        type,
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



            let query = hotelsModel.aggregate().match(matchQuery);

            
            
            
            // filter
            if (fromDate && toDate) {
                query.match({
                    created_at: {
                        $lte: new Date(toDate),
                        $gte: new Date(fromDate)
                    }
                });
            }

            if (filter) {
                query.match({
                    $or: [
                        {
                            hotel_name: {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        },
                        {
                            "location.address": {
                                $regex: filter,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                hotel_id: 1,
                hotel_name: 1,
                location: 1,
                stars: 1,
                number_of_rooms: 1,
        })

            // sort
            query
                .sort({
                    [sort]: order, start_date: order
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

                .project({
                    total_count: true,
                    hotels: {
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

    static async gethotel(id) {

        let result = await hotelsModel.findOne({
            hotel_id: id
        })
        if (!result) {
            return null;
        }

        return result; 
    }


    static async delete(_id) {
        const hotel = await hotelsModel.delete({_id});

        return hotel;
    }
}

module.exports = hotel;
