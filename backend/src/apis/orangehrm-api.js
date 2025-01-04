const orangeHRMService = require('../services/orangehrmService');

exports.getEmployees = (req, res) => {
    orangeHRMService.getAllEmployees()
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.send(_);
            // res.status(500).send();
    });
}

exports.getEmployeeById = (req, res) => {
    orangeHRMService.getEmployeeByID(req.params.id)
        .then((employeeById) => {
            res.send(employeeById);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getBonusSalariesByEmployee = (req, res) => {
    orangeHRMService.getBonusSalariesByEmployee(req.params.id)
        .then((bonusSalaries) => {
            res.send(bonusSalaries);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.addBonusSalary = (req, res) => {
    orangeHRMService.add(req.body)
        .then(_ => {
            res.send('Successfully saved');
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}
