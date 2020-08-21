const NotesHelper = require('../../helpers/notes.helper');
const omit = require('lodash/omit');
const { EVENT_OR_NEWS_NOT_FOUND} = require('../../errorDefinition/errors.map');
class note {
    static async create(req, res) {
        try {
            const body = req.body
            body.uid =  currentUser.uid


            const note = await NotesHelper.create(body);


            res.sendSuccess(note);
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
                filter: req.query.filter,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate,
                last_retrieved: req.query.last_retrieved,
                type: req.query.type,
                isApproved: req.query.is_approved,
                page: req.query.page,
                recordPerPage: req.query.pageSize,
                platform: req.headers.platform,
            };

            const Notes = await NotesHelper.getnotes(options);

            res.sendSuccess(Notes);
            // res.sendSuccess(Notes);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async update(req, res) {
        try {
            const options = {
                _id: req.params.id,
                note: req.body
            };
            const noteupdate = await NotesHelper.update(options);

            res.sendSuccess({noteupdate});
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error); 
        }
    }

    static async show(req, res) {
        try {
            const note = await NotesHelper.getnote(req.params.id);
            if (!note){
                throw EVENT_OR_NEWS_NOT_FOUND;
            }

            res.sendSuccess(note);
        } catch (error) {
            console.log(error);
            res.sendError(error, req.header('languageId'),null,error);
        }
    }

    static async delete(req, res) {
        try {
            const note = await NotesHelper.delete(req.params.id);

            res.sendSuccess(note);
        } catch (error) {
            console.log(error);
            res.sendError(error, res.header('languageId'),null,error);
        }
    }
}

module.exports = note;