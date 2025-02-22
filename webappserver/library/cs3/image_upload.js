var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
const AWS = require('aws-sdk');
// require('dotenv').config();


const { 
  SPACES_URL = 'sgp1.digitaloceanspaces.com',
  SPACES_KEY = 'WZ5AZIKKJYFUMCZR5KGD',
  SPACES_SECRET = 'ZWvPdXL2vkBKvF2XlNUVfJKYDueNQHB8R7lsRNBCEpQ',
  BUCKET_NAME = 'chip',
  BUCKER_FOLDER = 'https://vcsc-website.sgp1.digitaloceanspaces.com/cms'
} = process.env;

const spacesEndpoint = new AWS.Endpoint(SPACES_URL);
const S3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET
});

function uploadFileToS3(filename, fileContent, encoding, type, callback) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${BUCKER_FOLDER}/images/${filename}`,
    Body: fileContent,
    ACL: 'public-read',
    ContentEncoding: encoding, // optional
    contentType: type
  };

  S3.upload(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
      return callback(null, {link: data.Location});
    }
  });
}



// Gets a filename extension.
function getExtension(filename) {
  return filename.split('.').pop();
}

// Test if a image is valid based on its extension and mime type.
function isImageValid(filename, mimetype) {

  var allowedExts = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'];
  var allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml'];

  // Get image extension.
  var extension = getExtension(filename);

  return allowedExts.indexOf(extension.toLowerCase()) != -1  &&
    allowedMimeTypes.indexOf(mimetype) != -1
  ;
}

function upload (req, callback) {

  // The route on which the image is saved.
  var fileRoute = './public/froala/images/';

  // Server side file path on which the image is saved.
  var saveToPath = null;

  // Flag to tell if a stream had an error.
  var hadStreamError = null;

  // Used for sending response.
  var link = null;

  let chunks = [], fname, ftype, fEncoding;

  // Stream error handler.
  function handleStreamError(error) {

    // Do not enter twice in here.
    if (hadStreamError) {
      return;
    }
    hadStreamError = error;

    // Cleanup: delete the saved path.
    if (saveToPath) {
      return fs.unlink(saveToPath, function (err) {
        return callback(error);
      });
    }

    return callback(error);
  }

  // Instantiate Busboy.
  try {
    var busboy = new Busboy({ headers: req.headers });
  } catch(e) {
    return callback(e);
  }

  // Handle file arrival.
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

    // Check fieldname:
    if ('file' != fieldname) {

      // Stop receiving from this stream.
      file.resume();
      return callback('Fieldname is not correct. It must be "file".');
    }

    // Generate link.
    // var randomName = new Date().getTime() + '.' + getExtension(filename);
    link = fileRoute + filename;

    // Generate path where the file will be saved.

    var appDir = path.dirname(require.main.filename);
    saveToPath = path.join(appDir, link);

    // Pipe reader stream (file from client) into writer stream (file from disk).
    file.on('error', handleStreamError);

    // Create stream writer to save to file to disk.
    var diskWriterStream = fs.createWriteStream(saveToPath);
    diskWriterStream.on('error', handleStreamError);

    // Validate image after it is successfully saved to disk.
    diskWriterStream.on('finish', function() {

      // Check if image is valid
      var status = isImageValid(saveToPath, mimetype);

      if (!status) {
        return handleStreamError('File does not meet the validation.');
      }

      return callback(null, {link: link});
    });

    // Save image to disk.
    //file.pipe('diskWriterStream');

    fname = filename.replace(/ /g,"_");
    ftype = mimetype;
    fEncoding = encoding;

    file.on('data', function(data) {
      chunks.push(data)
    });
  });

  busboy.on('finish', function() {
    uploadFileToS3(fname, Buffer.concat(chunks), fEncoding, ftype, callback);
  });

  // Handle file upload termination.
  busboy.on('error', handleStreamError);
  req.on('error', handleStreamError);

  // Pipe reader stream into writer stream.
  return req.pipe(busboy);
}


// function upload (req, callback) {

//   // The route on which the image is saved.
//   var fileRoute = './uploads/froala/images/';

//   // Server side file path on which the image is saved.
//   var saveToPath = null;

//   // Flag to tell if a stream had an error.
//   var hadStreamError = null;

//   // Used for sending response.
//   var link = null;

//   // Stream error handler.
//   function handleStreamError(error) {

//     // Do not enter twice in here.
//     if (hadStreamError) {
//       return;
//     }
//     hadStreamError = error;

//     // Cleanup: delete the saved path.
//     if (saveToPath) {
//       return fs.unlink(saveToPath, function (err) {
//         return callback(error);
//       });
//     }

//     return callback(error);
//   }

//   // Instantiate Busboy.
//   try {
//     var busboy = new Busboy({ headers: req.headers });
//   } catch(e) {
//     return callback(e);
//   }

//   // Handle file arrival.
//   busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

//     // Check fieldname:
//     if ('file' != fieldname) {

//       // Stop receiving from this stream.
//       file.resume();
//       return callback('Fieldname is not correct. It must be "file".');
//     }

//     // Generate link.
//     // var randomName = new Date().getTime() + '.' + getExtension(filename);
//     link = fileRoute + filename;

//     // Generate path where the file will be saved.
//     var appDir = path.dirname(require.main.filename);
//     saveToPath = path.join(appDir, link);

//     // Pipe reader stream (file from client) into writer stream (file from disk).
//     file.on('error', handleStreamError);

//     // Create stream writer to save to file to disk.
//     var diskWriterStream = fs.createWriteStream(saveToPath);
//     diskWriterStream.on('error', handleStreamError);

//     // Validate image after it is successfully saved to disk.
//     diskWriterStream.on('finish', function() {

//       // Check if image is valid
//       var status = isImageValid(saveToPath, mimetype);

//       if (!status) {
//         return handleStreamError('File does not meet the validation.');
//       }

//       return callback(null, {link: link});
//     });


//     // Save image to disk.
//     file.pipe(diskWriterStream);
//   });

//   // Handle file upload termination.
//   busboy.on('error', handleStreamError);
//   req.on('error', handleStreamError);

//   // Pipe reader stream into writer stream.
//   return req.pipe(busboy);
// }

module.exports = upload;