const router = require(`express`).Router() ;
const multer = require('multer');
const multerS3 = require('multer-s3');
const imageService = require(`../services/imagrServise`) ;
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  });
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'YOUR_BUCKET_NAME',
      acl: 'public-read',  // Позволява публичен достъп до файловете
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + '-' + file.originalname);
      },
    }),
  });

// app.put('*', async (req,res) => {
//     let filename = req.path.slice(1)
  
//     console.log(typeof req.body)
  
//     await s3.putObject({
//       Body: JSON.stringify(req.body),
//       Bucket: process.env.BUCKET,
//       Key: filename,
//     }).promise()
  
//     res.set('Content-type', 'text/plain')
//     res.send('ok').end()
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({ imageUrl: req.file.location });
  });

// router.post(`/:fileName`  , async(req ,res) => {
//     const textMessageId  = req.params.fileName ; 
//     try{
//         let s3File = await s3.putObject({
//       Body: JSON.stringify(req.body),
//       Bucket: process.env.BUCKET,
//       Key: filename,
//     }).promise();
//     res.set('Content-type', s3File.ContentType)
//     res.json({imageUrl :`{URL}/${fileName}`})
// }catch(err){
//     res.status(400).json({ error : err.message });
// }} );
router.get(`/:filename`  , async(req ,res) => {
    const {username , password} = req.body ; 
    try{
    const user =  await authServices.addNewUser(username , password) ; 
    res.json(user);
    }catch(err){
        res.status(400).json({ error : err.message });
    }
} );
router.delete(`/`  , async(req ,res) => {
    const {username , password} = req.body ; 
    try{
    const user =  await authServices.addNewUser(username , password) ; 
    res.json(user);
    }catch(err){
        res.status(400).json({ error : err.message });
    }
} );
module.exports = router ;