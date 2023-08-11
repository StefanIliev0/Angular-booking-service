const router = require(`express`).Router() ;
// const multer = require('multer');
// const multerS3 = require('multer-s3');
const imageService = require(`../services/imagrServise`) ;
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId : "ASIAURG6Q27L57O7A745",
    region : "eu-central-1" ,
    secretAccessKey : "isTBsZZPJ5ClbkwgDQv8Kc38uWJRoVcg8quSYaQn",
    // sessionToken : "IQoJb3JpZ2luX2VjEOv//////////wEaCXVzLWVhc3QtMiJHMEUCIQDUB1uXzn626jNosTosRi5i0jQrrHGjMkI/zT34f9RmLQIgOGOzjvt5jb8kS+MzPJ5sYtZFwTvA9YSlpXu7aFWET2UqswIIlf//////////ARAAGgwzMTE4NTE4MDA1MzUiDEbPTxO7gtLJfA2L6SqHAqjFXazN3BT59CQcMRvFIlCGWyqCDuEZ3Reb0t7SwAUhORbiA4zpSt8eHTZ20Yg0/fQII4aST8zEQYVo/QFwCBq+znVn6o79RgKzN8agrhAtCjUPTxIFEU/6+uo6CBlicZWG+vFr6vGQO2vrAUwvz0WaorWGHBn9N/kKXitQPCFj6IQfH7udym8/XSNU4KiFd29BBLOvIH7LiepuN+1ZGfq1fY2vBnNkimTq87gNVT34xZxTChWKWxeImxu4JPMZSxfa8lj1i35cWwEfK+u28zzQfmGxUXBvxuBNe4pZUPg8XA6bCAa/u3DcrQklq/cI7tA/XQZMMQ99IShSV4icCZ0RD7O9TmIvMPSsyqYGOp0BrWCIVXPm200wDLl2IUcYLfb8w+XmFS5BxzmY2dRDatXYoteY5nitl/f6prAKGi1csf3EHvKqQ4RmnSr/VY1I7doBHUOa5o9CytYdvcIw0lNzlf2JwrBvQS0ezQ67ryQZ/EHtuPdpT5jzLrL8J/87d/tbp1ANpK/nofbvNynrDpe6kzZVowU++j/YeD4MRzDlB0nhykN7dRfchLXDUQ=="

 });
router.post(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    console.log(fileName)
    try{
        let s3File = await s3.putObject({
      Body: JSON.stringify(req.body),
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    res.json({imageUrl :`https://kind-lime-attire.cyclic.app/images/${fileName}`})
}catch(err){
    console.log(err)
    res.status(400).json({ error : err.message });
}} );
// /Cannot GET https://kind-lime-attire.cyclic.app/images/393968_370675896281444_100000171110684_1618670_1328944907_n.jpg


router.get(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    console.log(fileName)
    try{
        let s3File = await s3.getObject({
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    let extension = fileName.split(`.`)[fileName.split('.').length - 1 ]
    res.set('Content-type',`image/${extension}`)
    res.send(s3File.Body);
}catch(err){
    console.log(err)
    res.status(400).json({ error : err.message });
}} );
router.delete(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    console.log(fileName)
    try{
        let s3File = await s3.deleteObject({
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    res.json({})
}catch(err){
    console.log(err)
    res.status(400).json({ error : err.message });
}} );
module.exports = router ;