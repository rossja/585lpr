'use strict';

require('dotenv-safe').load();

const express    = require('express');
const app        = express();
const multipart  = require('connect-multiparty');
const cloudinary = require('cloudinary');
const cors       = require('cors');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(helmet());

const multipartMiddleware = multipart();

cloudinary.config({
  cloud_name : process.env.cloudinary_cloud,
  api_key    : process.env.cloudinary_api_key,
  api_secret : process.env.cloudinary_api_secret
});


// routing
app.post('/upload', multipartMiddleware, function(req, res) {
  cloudinary.v2.uploader.upload(req.files.image.path,
    {
      ocr: "adv_ocr"
    }, function(error, result) {
        if( result.info.ocr.adv_ocr.status === "complete" ) {
          var lpr_text = res.json(result.info.ocr.adv_ocr.data[0].textAnnotations[0].description);
        }
    });
});

const listener = app.listen(process.env.node_port, function() {
  console.log('listening on port ' + listener.address().port);
})