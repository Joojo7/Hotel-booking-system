
const notesModel = require('../models/notes/notes.model');
const ObjectId = require('mongoose').Types.ObjectId;
const { INVALID_COORDS } = require('../errorDefinition/errors.map');
const isCoords = require('is-valid-coordinates');



class notes {
    //this is used to create a note
    static async create(note) {
        let specialId = new ObjectId();
        try {
            const result = await notesModel.create(note);

            return result;
        } catch (error) {
            throw error;
        }
    }

    //used to update a note
    static async update({ _id, note }) {
        try {
            const result = await notesModel.findOneAndUpdate( 
                { _id },
                { $set: note }, {new: true}
            );

        

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getnotes({
        sort,
        order,
        page,
        recordPerPage,
        filter,
        fromDate,
        toDate,
        isApproved,
        type,
        last_retrieved,
        platform
    }) {
        try {
            sort = sort || 'updated_at';
            order = order || 'desc';
            filter = filter || '';
            type = type;
            isApproved = isApproved;
            platform = platform;
            last_retrieved = last_retrieved || 0;
            page = page || 1;
            recordPerPage = parseInt(recordPerPage) || 10000;
            const startIndex = (page - 1) * recordPerPage;

            let matchQuery = {
              deleted: false
            };



            let query = notesModel.aggregate().match(matchQuery);

            
            
            
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
                            title: {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        },
                        {
                            description: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            text: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                title: 1,
                text: 1,
                note_id: 1,
                created_at: 1,
                updated_at: 1
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
                    notes: {
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

    static async getnote(id) {

        let result = await notesModel.findOne({
            note_id: id
        })
        if (!result) {
            return null;
        }

        return result; 
    }


    static async delete(_id) {
        const note = await notesModel.delete({_id});

        return note;
    }
}

module.exports = notes;
