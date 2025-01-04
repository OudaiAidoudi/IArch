const evaluationService = require("../services/evaluation-record-service.js");
const {ObjectId} = require("mongodb");

exports.getAllEvaluationRecords = (req, res) => {
    const db = req.app.get('db');

    evaluationService.getAll(db).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getGoals = (req, res) => {
    const db = req.app.get('db');

    evaluationService.getAllGoals(db).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getEvaluationRecordsById = (req, res) =>  {
    const db = req.app.get('db');

    evaluationService.getById(db, ObjectId(req.params._id)).then(evaRec => {
        // Check if this Object belongs to the asking salesman
        if (req.checkID && evaRec.salesManID != req.session.user._id) {
            res.status(401).send("Salesman may only access their own data.");
        }

        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getEvaluationRecordsOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.getBySalesmanID(db, req.params.salesManID).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.addEvaluationRecord = (req, res) => {
    const db = req.app.get('db');

   evaluationService.add(db, req.body)
    .then(_id => {
        res.send(_id.toString());
    }).catch((e) => {
        res.status(404).send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.updateEvaluationRecordById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.updateById(db, ObjectId(req.params._id), req.body)
        .then(evaluationRecord => {
            res.send(evaluationRecord);
        }).catch((e) => {
            res.status(404).send(e.message);
        }).catch(_ => {
            res.status(500).send();
        })
}

exports.deleteEvaluationRecord = (req, res) => {
    const db = req.app.get('db');

   evaluationService.delete(db, ObjectId(req.params._id))
        .then(_id => {
            res.send(_id.toString());
        }).catch(() => {
            res.status(404).send('ID not found!');
    }).catch(_ => {
        res.status(500).send();
    })

}

exports.deleteAllEvaluationRecordsOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.deleteBySalesmanID(db, req.params.salesManID)
        .then(salesManID => {
            res.send(salesManID);
        }).catch((e) => {
            res.status(404).send(e.message);
        }).catch(_ => {
            res.status(500).send();
        })
}