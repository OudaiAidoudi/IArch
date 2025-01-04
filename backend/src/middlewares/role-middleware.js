const Roles = {
    CEO: "CEO",
    SALESMAN: "SALESMAN",
    HR: "HR"
};

exports.Roles = Roles;

exports.roleAuthentification = (roles = [], checkID = false) => {
    return (req, res, next) => {
        // If admin allow everything
        if (req.session.user.isAdmin) {
            next();
            return;
        }

        const userRole = req.session.user.role;
        // Stop unauthorized roles from accessing functions        
        if (!(typeof userRole === 'string' && roles.includes(userRole))) {
            res.status(401).send("Role " + userRole + " not authorized to use this function.")
            return;
        }

        if (userRole === Roles.SALESMAN){
            // Next function has to check if object belongs to salesman. Not possible to do here.
            if (checkID) {
                req.checkID = true;
                next();
                return;
            }

            // Salesman can only do stuff for themselves and no other salesman.
            if ((req.params._id && req.params._id != req.session.user._id) || (req.params.salesManID && req.params.salesManID != req.session.user._id)) {
                res.status(401).send("Salesman may only access their own data.")
                return;
            }
        }

        //This role is allowed to do this
        next();
        return;
    }
} 