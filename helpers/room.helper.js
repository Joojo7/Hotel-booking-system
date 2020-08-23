
const roomsModel = require('../models/room/room.model');



class Room {


 //this is used to create a room
 static async create(room) {
    try {
        const result = await roomsModel.create(room);

        return result;
    } catch (error) {
        throw error;
    }
}

 //   TODO: UPDATE ROOM HELPER


    
    static async getRooms({
        sort,
        order,
        page,
        recordPerPage,
        filter,
        fromDate,
        toDate,
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



            let query = roomsModel.aggregate().match(matchQuery);

            
            
            
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
                            room_name: {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                room_id: 1,
                room_name: 1,
                room_capacity: 1,
                hotel_id: 1,
                price: 1
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

                .project({
                    total_count: true,
                    rooms: {
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

    static async getRoom(room_id,hotel_id) {

        let result = await roomsModel.findOne({
            room_id, hotel_id
        })
        if (!result) {
            return null;
        }

        return result; 
    }


    static async delete(_id) {
        const room = await roomsModel.delete({_id});

        return room;
    }
}

module.exports = Room;
