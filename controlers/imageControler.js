const router = require(`express`).Router() ;
const imageService = require(`../services/imagrServise`) ;
const AWS = require("aws-sdk");


const s3 = new AWS.S3();
router.post(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    try{
        let s3File = await s3.putObject({
      Body: req.body,
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    res.json({imageUrl :`https://kind-lime-attire.cyclic.app/images/${fileName}`})
}catch(err){
    res.status(400).json({ error : err.message });
}} );

router.get(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    try{
        let s3File = await s3.getObject({
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    let extension = fileName.split(`.`)[fileName.split('.').length - 1 ]
    res.set('Content-type',`image/${extension}`)
    res.send(s3File.Body);
}catch(err){
    res.status(400).json({ error : err.message });
}} );
router.delete(`/:fileName`  , async(req ,res) => {
    const fileName  = req.params.fileName ; 
    try{
        let s3File = await s3.deleteObject({
      Bucket: 'cyclic-kind-lime-attire-eu-central-1',
      Key: fileName,
    }).promise();
    res.json({})
}catch(err){
    res.status(400).json({ error : err.message });
}} );
module.exports = router ;