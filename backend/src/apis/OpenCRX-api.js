const openCRXService = require("../services/opencrxService");

exports.getAccounts = (req, res) => {
    openCRXService.getAllAccounts().then((accounts) => {
        res.send(accounts);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getAccountByUID = (req, res) => {
    openCRXService.getAccountByUID(req.params.uid)
        .then((accountByUID) => {
            res.send(accountByUID);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.getProducts = (req, res) => {
    openCRXService.getAllProducts().then((products) => {
        res.send(products);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getProductByUID = (req, res) => {
    openCRXService.getProductByUID(req.params.uid)
        .then((productByUID) => {
            res.send(productByUID);
        }).catch(_ => {
        res.status(500).send();
    });

}

exports.getSalesOrders = (req, res) => {
    openCRXService.getAllSalesOrders().then(salesOrders => {
        res.send(salesOrders);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getSalesOrderByUID = (req, res) => {
    openCRXService.getSalesOrderByUID(req.params.uid)
        .then((salesOrderByUID) => {
            res.send(salesOrderByUID);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.getPositions = (req, res) => {
    openCRXService.getAllPositionsByUID(req.params.uid)
        .then((positions) => {
            res.send(positions);
        }).catch(_ => {
        res.status(500).send();
    });

}