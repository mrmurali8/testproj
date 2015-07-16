/*
 * GET test listing.
 */

exports.list = function(req, res){
    var matrixId = req.query.matrixId ? ' and t1.matrix_id='+req.query.matrixId : '';
    var obrId = req.query.obrId ? ' and t1.obr_type_id='+req.query.obrId : '';
    var segment2 = req.query.segment2 ? ' and t1.segment_num2='+req.query.segment2 : '';
    var segment3 = req.query.segment3 ? ' and t1.segment_num3='+req.query.segment3 : '';
    var testStatus = req.query.testStatus ? req.query.testStatus : 'ACTIVE';
    var sql ='select * from test1 t1 LEFT OUTER JOIN  test_att_lookups t2 on'+
    ' t1.matrix_id = t2.matrix_id and t1.obr_type_id = t2.obr_type_id and'+
    ' t1.segment_num2 = t2.segment_num2 and t1.segment_num3 = t2.segment_num3'+
    ' where t1.status="'+testStatus+'"'+ matrixId + obrId + segment2 + segment3;
    req.getConnection(function(err,conn){
        if (err) console.log("Cannot Connect -> ",err);
        var query = conn.query(sql,function(err,rows){
            if(err){
                console.log("Mysql error, check your query",err);
            }
            res.send(rows);
        });

    });
};

/*
 * Create test
 */
exports.create = function(req, res){
    //validation
    req.assert('lab_test_status','Lab Status is required').notEmpty();
    req.assert('test_start_date','Start date is required').notEmpty();
    req.assert('object_version_id','Object Version ID is required').notEmpty();
    req.assert('created_by','Created by is required').notEmpty();
    req.assert('creation_date','Creation date is required').notEmpty();
    req.assert('last_updated_by','Last update by is required').notEmpty();


    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        LAB_TEST_STATUS:req.body.lab_test_status,
        TEST_START_DATE:req.body.test_start_date,
        OBJECT_VERSION_ID:req.body.object_version_id,
        CREATED_BY:req.body.created_by,
        CREATION_DATE:req.body.creation_date,
        LAST_UPDATED_BY:req.body.last_updated_by,
        LAST_UPDATE_DATE:req.body.last_update_date,
        MATRIX_ID:req.body.matrix_id,
        OBR_TYPE_ID:req.body.obr_type_id,
        SEGMENT_NUM2:req.body.segment_num2,
        SEGMENT_NUM3:req.body.segment_num3
    };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("INSERT INTO test1 set ? ",data, function(err, rows){

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

    var test_id = req.params.testId;

    req.getConnection(function(err,conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("SELECT * FROM test1 WHERE test_id = ? ",[test_id],function(err,rows){

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
    var test_id = req.body.test_id;

    //validation
    req.assert('lab_test_status','Lab Status is required').notEmpty();
    req.assert('test_start_date','Start date is required').notEmpty();
    req.assert('object_version_id','Object Version ID is required').notEmpty();
    req.assert('created_by','Created by is required').notEmpty();
    req.assert('creation_date','Creation date is required').notEmpty();
    req.assert('last_updated_by','Last update by is required').notEmpty();
    req.assert('last_update_date','Last update date is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }
    //get data
    var data = {
        LAB_TEST_STATUS:req.body.lab_test_status,
        TEST_START_DATE:req.body.test_start_date,
        OBJECT_VERSION_ID:req.body.object_version_id,
        CREATED_BY:req.body.created_by,
        CREATION_DATE:req.body.creation_date,
        LAST_UPDATED_BY:req.body.last_updated_by,
        LAST_UPDATE_DATE:req.body.last_update_date,
        MATRIX_ID:req.body.matrix_id,
        OBR_TYPE_ID:req.body.obr_type_id,
        SEGMENT_NUM2:req.body.segment_num2,
        SEGMENT_NUM3:req.body.segment_num3,
        STATUS:req.body.status
    };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("UPDATE test1 set ? WHERE test_id = ? ",[data,test_id], function(err, rows){

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
    var test_id = req.params.testId;

    req.getConnection(function (err, conn) {

        if (err) console.log("Cannot Connect -> ",err);

        var query = conn.query("DELETE FROM test1  WHERE test_id = ? ",[test_id], function(err, rows){

            if(err){
                console.log("Mysql error, check your query",err);
            }

            res.sendStatus(200);

        });
    });
};

