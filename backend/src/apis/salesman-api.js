const salesmenService = require("../services/salesman-service");

exports.getSalesmen = (req, res) => {
    const db = req.app.get('db');

    salesmenService.getAll(db).then(salesmen => {
        res.send(salesmen);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getSalesManByFirstname = (req, res) => {
    const db = req.app.get('db');

    salesmenService.getSalesManByFirstname(db, req.params.firstname)
        .then(salesmenByFirstname => {
            res.send(salesmenByFirstname);
        }).catch(_ => {
            res.status(500).send();
    })
}

exports.getSalesManById = (req, res) => {
    const db = req.app.get('db');

    salesmenService.getSalesManById(db, req.params._id)
        .then(salesmenById => {
            res.send(salesmenById);
        }).catch(_ => {
            res.status(500).send();
    })
}

exports.addSalesman = (req, res) => {
    const db = req.app.get('db');

    salesmenService.add(db, req.body)
        .then(_id => {
            res.send(_id.toString());
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.updateSalesManById = (req, res) => {
    const db = req.app.get('db');

    salesmenService.update(db, req.params._id, req.body)
        .then((salesMan) => {
            res.send(salesMan);
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.deleteSalesMan = (req, res) => {
    const db = req.app.get('db');

    salesmenService.delete(db, req.params._id)
        .then(_id => {
            res.send(_id);
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.createApiSalesmen = (req, res) => {
    const db = req.app.get('db');

    salesmenService.getSalesmenFromAPI(db)
        .then(_id => {
            res.send({"message": "Successfully updated DB"});
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.deleteAllSalesmen = (req, res) => {
    const db = req.app.get('db');

    salesmenService.deleteAll(db)
        .then(response => {
            res.send(response);
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}