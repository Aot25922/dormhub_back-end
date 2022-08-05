const multer = require('multer');
const path = require('path');
var fs = require('fs');
const console = require('console');
const ext = ['.jpg', '.png', '.jpeg', '.gif'];
const directory = 'static/image/'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname.includes("dorm_")) {
            if (file.fieldname.includes("roomType")){
                roomtypePath = path.join(directory, 'roomType')
                if (!fs.existsSync(roomtypePath)){
                    fs.mkdirSync(roomtypePath);
                }
                cb(null, roomtypePath)
            }else{
                dormPath = path.join(directory, 'dorm')
                if (!fs.existsSync(dormPath)){
                    fs.mkdirSync(dormPath);
                }
            cb(null, path.join(dormPath))
            }
        } else{
            throw new Error('sdfdf')
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname.includes("dorm_")) {
            if (file.fieldname.includes("roomType")) {
                fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
                cb(null, fileName);
            } else {
                fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
                cb(null, fileName);
            }
        }else{
            throw new Error('Bruh')
        }
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        try{
            // console.log(req.body)
            let data = JSON.parse(req.body.data)
        }
        catch(err){
            var error = new Error('Input Error to convert')
            error.status = 403
            console.log(err)
            return cb(error)
        }
        var fileExt = path.extname(file.originalname);
        if ((file.fieldname.includes("dorm_roomType") || file.fieldname.includes("dorm_")) && ext.includes(fileExt)) {
            cb(null, true)
        }
        else {
            var error = new Error('Missing Fieldname')
            error.status = 403
            cb(error)
        }

    },
    // limits: {
    //     fileSize: 1024 * 1024
    // }
}).any()

exports.multerError = multer.MulterError
exports.upload = upload 