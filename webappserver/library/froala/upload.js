var upload_file = require("./file_upload.js");

var upload_image = require("./image_upload.js");

var upload_video = require("./video_upload.js");

const config    = require('../../config/config');

var gm = require('gm').subClass({imageMagick: true});

var FroalaEditor = require('../../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');

module.exports = (req, res, link) => {


// File POST handler.
    if(link == '/file_upload'){
        upload_file(req, function(err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            data.link = config.base_url + data.link.slice(2);
            res.send(data);
        });
    }

    // Image POST handler.
    if(link == '/image_upload'){
        upload_image(req, function(err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            data.link = config.base_url + data.link.slice(2);
            res.send(data);
        });
    }

    // Video POST handler.
    if(link == '/video_upload'){
        upload_video(req, function(err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            data.link = config.base_url + data.link.slice(2);
            res.send(data);
        });
    }

     // upload manager
    if(link == '/load_images'){
        FroalaEditor.Image.list('./uploads/froala/images/', function(err, data) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            if(data.length > 0){
                for(let i = 0 ; i < data.length ;i++){
                    data[i].url = config.base_url + data[i].url.slice(2);
                    data[i].thumb = config.base_url + data[i].thumb.slice(2);
                }
            }
          
            
            return res.send(data);
        });
    }

    if(link == '/delete_image'){
        req.body.src = req.body.src.replace(config.base_url,'./');
        FroalaEditor.Image.delete(req.body.src, function(err) {
            if (err) {
                return res.status(404).end(JSON.stringify(err));
            }
            return res.end();
        });
     }

}