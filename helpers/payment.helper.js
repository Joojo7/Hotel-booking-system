
const paymentsModel = require('../models/payment/payment.model');



class Payment {


 //this is used to create a payment
 static async create(payment) {
    try {
        const result = await paymentsModel.create(payment);

        return result;
    } catch (error) {
        throw error;
    }
}

static async update({ payment_id, payment }) {
    try {
        const result = await paymentsModel.findOneAndUpdate( 
            { payment_id },
            { $set: payment }, {new: true}
        );

    
        return result;
    } catch (error) {
        throw error;
    }
}


    
    static async getPayments({
        sort,
        order,
        page,
        recordPerPage,
        filter,
        fromDate,
        toDate,
        status
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

            let query = paymentsModel.aggregate().match(matchQuery);
            
            
            // filter
            if (fromDate && toDate) {
                query.match({
                    created_at: {
                        $lte: new Date(toDate),
                        $gte: new Date(fromDate)
                    }
                });
            }

            if (status) {
                query.match({
                    status: status
                });
            }

            if (filter) {
                query.match({
                    $or: [
                        {
                            payment_name: {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        },
                        {
                            status: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

           

            query.project({
                payment_id: 1,
                status: 1,
                method: 1,
                credit_card: 1,
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

                .project({
                    total_count: true,
                    payments: {
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

    static async getPayment(id) {

        let result = await paymentsModel.findOne({
            payment_id: id
        })
        if (!result) {
            return null;
        }

        return result; 
    }


    static async delete(_id) {
        const payment = await paymentsModel.delete({_id});

        return payment;
    }
}

module.exports = Payment;
