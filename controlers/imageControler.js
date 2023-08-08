const router = require(`express`).Router() ;
const multer = require('multer');
const multerS3 = require('multer-s3');
const imageService = require(`../services/imagrServise`) ;
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId : "ASIAURG6Q27L57O7A745",
    region : "eu-central-1" ,
    secretAccessKey : "isTBsZZPJ5ClbkwgDQv8Kc38uWJRoVcg8quSYaQn",
    sessionToken : "IQoJb3JpZ2luX2VjEOv//////////wEaCXVzLWVhc3QtMiJHMEUCIQDUB1uXzn626jNosTosRi5i0jQrrHGjMkI/zT34f9RmLQIgOGOzjvt5jb8kS+MzPJ5sYtZFwTvA9YSlpXu7aFWET2UqswIIlf//////////ARAAGgwzMTE4NTE4MDA1MzUiDEbPTxO7gtLJfA2L6SqHAqjFXazN3BT59CQcMRvFIlCGWyqCDuEZ3Reb0t7SwAUhORbiA4zpSt8eHTZ20Yg0/fQII4aST8zEQYVo/QFwCBq+znVn6o79RgKzN8agrhAtCjUPTxIFEU/6+uo6CBlicZWG+vFr6vGQO2vrAUwvz0WaorWGHBn9N/kKXitQPCFj6IQfH7udym8/XSNU4KiFd29BBLOvIH7LiepuN+1ZGfq1fY2vBnNkimTq87gNVT34xZxTChWKWxeImxu4JPMZSxfa8lj1i35cWwEfK+u28zzQfmGxUXBvxuBNe4pZUPg8XA6bCAa/u3DcrQklq/cI7tA/XQZMMQ99IShSV4icCZ0RD7O9TmIvMPSsyqYGOp0BrWCIVXPm200wDLl2IUcYLfb8w+XmFS5BxzmY2dRDatXYoteY5nitl/f6prAKGi1csf3EHvKqQ4RmnSr/VY1I7doBHUOa5o9CytYdvcIw0lNzlf2JwrBvQS0ezQ67ryQZ/EHtuPdpT5jzLrL8J/87d/tbp1ANpK/nofbvNynrDpe6kzZVowU++j/YeD4MRzDlB0nhykN7dRfchLXDUQ=="

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
    console.log(fileName)
    try{
        let s3File = await s3.putObject({
      Body: JSON.stringify(req.body),
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    console.log(s3File)
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