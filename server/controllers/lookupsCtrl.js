/*
 * GET users listing.
 */

exports.list = function(req, res){
    req.getConnection(function(err,conn){
        if (err) console.log("Cannot Connect -> ",err);
        var query = conn.query('SELECT * FROM test_att_lookups',function(err,rows){
            if(err){
                console.log("Mysql error, check your query",err);
            }
            res.send(rows);
        });

    });
};

/*
 * Create User
 */
exports.create = function(req, res){
    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("INSERT INTO test_att_lookups set ? ",data, function(err, rows){

            if(err){
                console.log("Mysql error, check your query",err);
            }

            res.sendStatus(200);

        });

    });
};

/*
 * get User
 */
exports.findOne = function(req, res){

    var id = req.params.id;

    req.getConnection(function(err,conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("SELECT * FROM test_att_lookups WHERE TEST_LOOKUP_ID = ? ",[id],function(err,rows){

            if(err){
                console.log("Mysql error, check your query",err);
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.send(rows[0]);
        });

    });
};

/*
 * update User
 */
exports.update = function(req, res){
    var id = req.body.id;

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("UPDATE test_att_lookups set ? WHERE TEST_LOOKUP_ID = ? ",[data,id], function(err, rows){

            if(err){
                console.log("Mysql error, check your query",err);
            }

            res.sendStatus(200);

        });

    });
};

/*
 * delete User
 */
exports.delete = function(req, res){
    var id = req.params.id;

    req.getConnection(function (err, conn) {

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("DELETE FROM test_att_lookups WHERE TEST_LOOKUP_ID = ? ",[id], function(err, rows){

            if(err){
                console.log("Mysql error, check your query",err);
            }

            res.sendStatus(200);

        });
    });
};

