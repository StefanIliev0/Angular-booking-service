const router = require(`express`).Router() ;
const companyServices = require(`../services/companyService`) ; 
const querystring = require('querystring');
const constants = require(`../lib/constats`) ; 

router.get(`/dashboard` , async (req, res , next)=>{
        try{
        let companyRoute = req.header("provideData");
        let colection  = await companyServices.getTablesInfo(companyRoute); 
            
        res.status(200).json(colection) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
router.get(`/getPaychecks/:companyName` ,  async (req, res , next)=>{
    try{
    const companyName = req.params.companyName ; 
    let sanCompanyName = companyName.replaceAll(` `,``);
    let paychekcs  = await companyServices.getPaychecks(sanCompanyName); 

    res.status(200).json(paychekcs) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
})
router.post(`/approvePaychecks` ,  async (req, res , next)=>{
    try{
    const companyName = req.body ; 
    let sanCompanyName = companyName.name.replaceAll(` `,``);
    // let paychekcs  = await companyServices.aprovePaychecks(sanCompanyName); 

    res.status(200).json({}) ;
}catch(err){
    res.status(400).json({ error : err.message });
}
})
    router.get(`/newHire` , async (req, res , next)=>{
        try{
        let companyRoute = req.header("provideData");
        let positions  = await companyServices.getPositions(companyRoute); 
    
        res.status(200).json(positions) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/newHire` , async (req, res , next)=>{
        try{
        let companyRoute = req.header("provideData"); 
        let body = req.body;
        let emplInfo  = await companyServices.addEmployee(companyRoute , body); 

        res.status(200).json(emplInfo) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.get(`/newContract/:id` , async (req, res , next)=>{
        try{
        const id = req.params.id ; 
        let companyRoute = req.header("provideData");
        let contractData  = await companyServices.getNewContractData(companyRoute , id); 
    
        res.status(200).json(contractData) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/newContract/:id` , async (req, res , next)=>{
        try{
        const body = req.body; 
        const id = req.params.id ; 
        let companyRoute = req.header("provideData");
        let contractData  = await companyServices.addNewContract(companyRoute, body , id); 
    
        res.status(200).json(contractData) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/addPaycheck/:id` , async (req, res , next)=>{
        try{
        const id = req.params.id ; 
        let body = req.body;
        let companyRoute = req.header("provideData");
        let contractData  = await companyServices.addLastPaycheck(companyRoute , id , body); 
    
        res.status(200).json({}) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/releseEmpl/:id` , async (req, res , next)=>{
        try{
        const id = req.params.id ; 
        let body = req.body;
        let companyRoute = req.header("provideData");
        let contractData  = await companyServices.setendDateToEmpl(companyRoute , id , body.endDate); 
    
        res.status(200).json({}) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.get(`/getEmplInfo/:companyName/:emplId`, async (req, res , next)=>{
        try{
        const user = req.user ; 
        const id = req.params.emplId ; 
        const companyName = req.params.companyName;
        let sanCompanyName = companyName.replaceAll(" ", '').replaceAll(`%20` , ''); 
        let emplInfo = await companyServices.getEmplInfo(sanCompanyName , id , user); 
        res.status(200).json(emplInfo) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.get(`/getEmplContract/:companyName/:emplId/:index`, async (req, res , next)=>{
        try{
        const user = req.user ; 
        const id = req.params.emplId ; 
        const companyName = req.params.companyName;
        const index =  req.params.index;
        let sanCompanyName = companyName.replaceAll(" ", '').replaceAll(`%20` , ''); 
        let emplInfo = await companyServices.getEmplContract(sanCompanyName , id , user , index); 
        res.status(200).json(emplInfo) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.get(`/getEmplPayslip/:companyName/:emplId/:index`, async (req, res , next)=>{
        try{
        const user = req.user ; 
        const id = req.params.emplId ; 
        const companyName = req.params.companyName;
        let sanCompanyName = companyName.replaceAll(" ", '').replaceAll(`%20` , ''); 
        const index =  req.params.index;
        let emplPayslip = await companyServices.getEmplPayslip(sanCompanyName , id , user , index); 
        res.status(200).json(emplPayslip);
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/getEmplInfo/:companyName/:emplId`, async (req, res , next)=>{
        try{
        const id = req.params.emplId ; 
        let body = req.body;
        const companyName = req.params.companyName;
        let sanCompanyName = companyName.replaceAll(" ", '').replaceAll(`%20` , ''); 
        let emplInfo = await companyServices.updateEmplInfo(sanCompanyName , id , body); 
        res.status(200).json({}) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });
    router.post(`/getEmplContract/:companyName/:emplId`, async (req, res , next)=>{
        try{
        const id = req.params.emplId ; 
        let body = req.body;
        const companyName = req.params.companyName;
        let sanCompanyName = companyName.replaceAll(" ", '').replaceAll(`%20` , ''); 
        let emplInfo = await companyServices.updateEmplContract(sanCompanyName , id , body); 
        res.status(200).json({}) ;
    }catch(err){
        res.status(400).json({ error : err.message });
    }
    });


    // auth

    router.post(`/login` , async (req, res ) => {
        const {email , password} = req.body ; 
        try{
        let {user} = await companyServices.verifyUser(email , password); 
        let companyName = email.split(`@`)[1].split(`.`)[0].toString();
        const token  = await companyServices.setToken(JSON.stringify({_id: user._id , permissions : user.permissions }));
        await companyServices.UpdateToken( companyName ,  token , user._id.toString()); 
        user.HcmToken = token ; 
        res.json({ user : user })
        }catch(err){
            res.status(400).json({ error : err.message });
        }}) ;  
    router.post(`/changePassword` , async (req, res ) => {
            const {userId , newPassword ,companyName} = req.body ; 
            try{
            await companyServices.changePassword(userId , newPassword ,companyName);
            res.json({}); 
    
            }catch(err){
                res.status(400).json({ error : err.message });
        }});  

        // admin 

     router.post(`/create_company`  , async(req ,res) => {
            const body = req.body ; 
            try{
            const company =  await companyServices.newCompany(body) ; 
            res.json({});
            }catch(err){
                res.status(400).json({ error : err.message });
            }
        } );   


    module.exports = router ;