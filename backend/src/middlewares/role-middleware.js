const Roles = {
    CEO: "CEO",
    SALESMAN: "SALESMAN",
    HR: "HR"
};

exports.Roles = Roles;

exports.roleAuthentification = (roles = [], checkID = false) => {
    return (req, res, next) => {
        // First check if session and user exist
        if (!req.session || !req.session.user) {
            return res.status(401).send("Not authenticated - Please log in");
        }

        // If admin allow everything
        if (req.session.user.isAdmin) {
            return next();
        }

        const userRole = req.session.user.role;

        // Check if userRole is valid
        if (!userRole) {
            return res.status(401).send("User role not found");
        }

        // Stop unauthorized roles from accessing functions
        if (!(typeof userRole === 'string' && roles.includes(userRole))) {
            return res.status(401).send("Role " + userRole + " not authorized to use this function.");
        }

        if (userRole === Roles.SALESMAN) {
            // Next function has to check if object belongs to salesman
            if (checkID) {
                req.checkID = true;
                return next();
            }

            // Salesman can only do stuff for themselves
            const salesmanId = req.session.user._id;
            const requestedId = req.params._id || req.params.salesManID;

            if (requestedId && requestedId != salesmanId) {
                return res.status(401).send("Salesman may only access their own data.");
            }
        }

        // This role is allowed to do this
        return next();
    };
};