const router = require(`express`).Router() ;
const multer = require('multer');
const multerS3 = require('multer-s3');
const imageService = require(`../services/imagrServise`) ;
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: 'ASIAURG6Q27LY5UYMWNT',
    secretAccessKey: 'MNsbJodurhH9xLo09zpb4Ax0eleqVAy8DUG8LvFJ',
  });
//   const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: 'cyclic-kind-lime-attire-eu-central-1',
//       acl: 'public-read',  // Позволява публичен достъп до файловете
//       metadata: function (req, file, cb) {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: function (req, file, cb) {
//         cb(null, Date.now().toString() + '-' + file.originalname);
//       },
//     }),
//   });

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
// router.post('/upload', upload.single('image'), (req, res) => {
//     res.json({ imageUrl: req.file.location });
//   });

router.post(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    try{
        let s3File = await s3.putObject({
      Body: JSON.stringify(req.body),
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    res.set('Content-type', s3File.ContentType)
    res.json({imageUrl :`{URL}/${fileName}`})
}catch(err){
    res.status(400).json({ error : err.message });
}} );
// router.get(`/:filename`  , async(req ,res) => {
//     const {username , password} = req.body ; 
//     try{
//     const user =  await authServices.addNewUser(username , password) ; 
//     res.json(user);
//     }catch(err){
//         res.status(400).json({ error : err.message });
//     }
// } );
// router.delete(`/`  , async(req ,res) => {
//     const {username , password} = req.body ; 
//     try{
//     const user =  await authServices.addNewUser(username , password) ; 
//     res.json(user);
//     }catch(err){
//         res.status(400).json({ error : err.message });
//     }
// } );
module.exports = router ;