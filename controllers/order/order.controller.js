const OrderHelper = require('../../helpers/order.helper');
const omit = require('lodash/omit');
const { EVENT_OR_NEWS_NOT_FOUND} = require('../../errorDefinition/errors.map');
class order {
    static async create(req, res) {
        try {
            const body = req.body
            body.uid =  currentUser.uid


            const order = await OrderHelper.create(body);


            res.sendSuccess(order);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }


    static async index(req, res) {
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