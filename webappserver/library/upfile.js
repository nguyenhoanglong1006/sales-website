const fs = require('fs');

const config = require('../config/config');

module.exports = (data, existsFile = true) => {

    let mimeimages = (config.mimeimages) ? config.mimeimages : ['jpg', 'png', 'pdf'];

    let path = (data.hasOwnProperty('path')) ? data['path'].replace(config.base_url, '') : "";

    let upfile = data['add'];

    let delfile = data['del'];

    let fieldName = data['old'];

    let multiple = data['multiple'];

    let file = false;

    let savePublic = (path.split('/')[0] == 'public') ? true : false;

    let date = (new Date()).getFullYear() + ((((new Date()).getMonth() + 1) < 10) ? ('0' + ((new Date()).getMonth() + 1).toString()) : ((new Date()).getMonth() + 1).toString()) +'/';

    dir = './' + path + (savePublic ? '' : date);
   
    if (!fs.existsSync(dir) && upfile && fieldName) {

        try {

            fs.mkdirSync(dir);

        } catch (err) {

            console.log(err.message);

        }

    }
 
    if (delfile && delfile.length > 0) {

        for (var d = 0; d < delfile.length; d++) {

            let pathold = dir + delfile[d].split('/')[delfile[d].split('/').length - 1];
            
            if (fs.existsSync(pathold) && existsFile) {

                try {

                    fs.unlinkSync(pathold);

                } catch (e) {

                }

            }
        }
    }

    if (upfile && upfile.length > 0) {

        for (var u = 0; u < upfile.length; u++) {

            temp = upfile[u].name.split('.');

            extension = temp[temp.length - 1];

            namefile = temp.splice(0,temp.length - 1) + '.' + extension;

            newname = namefile;

            if (fs.existsSync(dir + namefile)) {

                file = dir.split('/')[2] == 'file' ?  true : false;

                newname = newname.split('.').splice(0,newname.split('.').length - 1)  + '-' + Date.now() + '.' + extension;

            }

            fdata = upfile[u].src.replace(/^data:(.*,)?/, '');

            fieldName.push( savePublic ? newname : (path + date + newname) );

            if(!file){

                fs.writeFile(dir + newname, fdata, { encoding: 'base64' }, function (err) {

                    if (err) { console.log(err.message); } else { }

                });
            }

            
        }
    }
   
    return !file ? (data['multiple'] == true ? (fieldName && fieldName.length > 0 ? JSON.stringify(fieldName) : '') : (fieldName ? fieldName[0] : '')) : 'exitFile';

}