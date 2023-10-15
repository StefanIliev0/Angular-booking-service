const Company = require("../models/Company");
const bcript = require(`bcrypt`) ; 
const {jwt} = require(`../utils/jsonWebToken`) ; 
const constants = require(`../lib/constats`) ; 



exports.getTablesInfo = async (compStr) => {
   let newStr =  compStr.replaceAll(` `,``).replaceAll(`%20`, '') ; 
   let companyArr = compStr.split(`/`);
   let sanCompanyName = companyArr[0].replaceAll(` `,``).replaceAll(`%20`, ''); 
   let companyName = companyArr[0];
   let currLevelName = companyArr.slice(-1)[0];
   let company = await Company.findOne({name : sanCompanyName}).select(`companyLevels contracts hierarhchy`).lean();
   if(!company){
    throw new Error(`No such company found!`)
   }

   let {grossSalaryPayment , totalPayment} = this.getLastMounthPayments(newStr , company.contracts);
   let subStrNames = this.getSubStrNames(newStr , company.hierarhchy , company.companyLevels); 
   let substructures = subStrNames?.names?.map( x => {
        let currentSalary = this.getLastMounthPayments(newStr + `/` + x , company.contracts);

        return ({
            name : x ,
            totalPayment : currentSalary.totalPayment ,
            grossSalaryPayment : currentSalary.grossSalaryPayment
        })
   })
   let tablesInfo = {
    current : {
        name : currLevelName ,
        title : company.companyLevels[companyArr.length - 1] || "ops", 
        totalPayment ,
        grossSalaryPayment
    },
     employes : this.getCyrrentEmployesWithLastMonthSalary(newStr, company.contracts), 
     substructures : substructures || [] 
   }
   tablesInfo.thisMounthAproved = company.thisMounthAproved ; 

 return tablesInfo
} 
exports.getPaychecks = async (companyName) => {
    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let  date = new Date();
    let nubmerDate = Number(date)
    let company = await Company.findOne({name : sanCompanyName}).select(`contracts`).lean();
    let contracts = company.contracts.filter(x => (Number(new Date(x.startDate)) < nubmerDate) && (!x.endDate || (new Date(x.endDate).getFullYear == date.getFullYear && new Date(x.endDate).getMonth == date.getMonth) || Number(new Date(x.endDate)) > nubmerDate) )
    let paychecks = [];
    contracts.forEach(x => {
    let paycheck = {
        overtimeHours : x.lastPayCheck.overtimeHours ,
        overtimeHolydaysHour : x.lastPayCheck.overtimeHolydaysHour ,
        unpaidHours : x.lastPayCheck.unpaidHours , 
        bonus : x.lastPayCheck.bonus,
        sickLeaveDays : x.lastPayCheck.sickLeaveDays,
        anualLeaveDays : x.lastPayCheck.anualLeaveDays,
        name : x.emplName,
        id : x.emplId,
        position : x.position, 
    }
    paychecks.push(paycheck) ; 
    })
    return paychecks; 
}
exports.aprovePaychecks = async (companyName) => {
    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let  date = new Date();
    let nubmerDate = Number(date)
    let company = await Company.findOne({name : sanCompanyName}).select(`contracts employees`);
    let contracts = company.contracts.filter(x => (Number(new Date(x.startDate)) < nubmerDate) && (!x.endDate || (new Date(x.endDate).getFullYear == date.getFullYear && new Date(x.endDate).getMonth == date.getMonth) || Number(new Date(x.endDate)) > nubmerDate) )
    contracts.forEach(x =>{
        let contract = company.contracts.find(y => y._id == x._id);
        let lastMonthPaycheck = contract.lastPayCheck; 
        let hourPay = Number((Number(contract.grossSalary)  / 176).toFixed(2)) ;
        let dayPay = Number((Number(contract.grossSalary)  / 22).toFixed(2)) ;
        let employee = company.employees.find( y => y._id.toString() == contract.emplId);
        let payCheck = {
            paymantDay : `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
            month : date.getMonth() ,
            year : date.getFullYear() ,
            overtimeHours : Number(+lastMonthPaycheck.overtimeHours * (hourPay * 1.5)).toFixed(2),
            overtimeHolydaysHour : Number(+lastMonthPaycheck.overtimeHolydaysHour * (hourPay * 2)).toFixed(2),
            unpaidHours : Number(+lastMonthPaycheck.unpaidHours * hourPay).toString(),
            bonus : Number(+contract.grossSalary * (+lastMonthPaycheck.bonus / 100)).toFixed(2),
            sickLeaveDays : Number(+lastMonthPaycheck.sickLeaveDays * dayPay).toFixed(2),
            anualLeaveDays : Number(+lastMonthPaycheck.anualLeaveDays * dayPay).toFixed(2),
            childBenefits : Number(+employee.aditionalInfo.children * 40).toFixed(2),
            }
            payCheck.taxes = {};
            payCheck.GrossPaytoEmpl = (Number(contract.grossSalary) + Number(payCheck.overtimeHours) + Number(payCheck.overtimeHolydaysHour) + Number(payCheck.bonus) + Number(payCheck.childBenefits) - Number(payCheck.sickLeaveDays) - Number(payCheck.unpaidHours)).toFixed(2); 
            payCheck.taxes.taxesForEmp = {};
            payCheck.taxes.taxesForEmp.incomeTax = (Number(payCheck.GrossPaytoEmpl) * (5 / 100)).toFixed(2);
            payCheck.taxes.taxesForEmp.SSC =(Number(payCheck.GrossPaytoEmpl) * (3 / 100)).toFixed(2);
            payCheck.taxes.taxesForEmp.at = (Number(payCheck.GrossPaytoEmpl) * (8 / 100)).toFixed(2);
            payCheck.taxes.taxesForEmpr = {};
            payCheck.taxes.taxesForEmpr.incomeTax = (Number(payCheck.GrossPaytoEmpl) * (3 / 100)).toFixed(2);
            payCheck.taxes.taxesForEmpr.SSC = (Number(payCheck.GrossPaytoEmpl) * (2 / 100)).toFixed(2);
            payCheck.taxes.taxesForEmpr.at = (Number(payCheck.GrossPaytoEmpl) * (2 / 100)).toFixed(2);  
            payCheck.netPaytoEmpl = (Number(payCheck.GrossPaytoEmpl) - Number(payCheck.taxes.taxesForEmp.incomeTax) - Number(payCheck.taxes.taxesForEmp.SSC) - Number(payCheck.taxes.taxesForEmp.at)).toFixed(2)
            payCheck.totalPay = (Number(payCheck.GrossPaytoEmpl) + Number(payCheck.taxes.taxesForEmpr.incomeTax) + Number(payCheck.taxes.taxesForEmpr.SSC) + Number(payCheck.taxes.taxesForEmpr.at)).toFixed(2)
            
            contract.payslips.push(payCheck);
            contract.lastPayCheck = {
                overtimeHours : '0',
                overtimeHolydaysHour : '0',
                unpaidHours : '0',
                bonus : '0',
                sickLeaveDays : '0',
                anualLeaveDays : '0',
            }

    })
    company.save()
    return ; 
}
exports.getPositions = async (compStr) => {
    let newStr =  compStr.replaceAll(` `,``).replaceAll(`%20`, '') ; 
    let companyArr = compStr.split(`/`);
    let sanCompanyName = companyArr[0].replaceAll(` `,``).replaceAll(`%20`, ''); 
    let currLevelName = companyArr.slice(-1)[0];
    let company = await Company.findOne({name : sanCompanyName}).select(`hierarhchy companyLevels`);
    if(!company){
     throw new Error(`No such company found!`)
    }
    let positionNames = this.getPositionNames(newStr , company.hierarhchy, company.companyLevels); 
  return positionNames
 } 
exports.getEmplInfo = async (companyName , id , user) => {
    
    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : sanCompanyName}).select(`employees`).lean();
    
    let empl =  company.employees.find(x => x?._id.toString() == id);
    let  isHavePermisions = "";
    let havePermisions  = false ; 
    let emplLevels = empl?.companyStructureLelev?.split(`/`);
    let isDone = false; 

    user?.permissions?.forEach((x , i) => {
        if(emplLevels){
        if( !isDone && x.title.replaceAll(" ", '') == emplLevels[i].replaceAll(" ", '')){
            if(x.can.menage || x.can.admin){
                havePermisions = true;
                isDone = true ; 
            }
             if(x.title.replaceAll(" ", '') != emplLevels[i].replaceAll(" ", '')){
                isDone = true;
            }
        }}
    })
    if(!havePermisions && empl._id.toString() != user._id ){
        throw new Error("You haven`t permissions for this user profile!")
    }
    if(havePermisions && empl._id.toString() != user._id){
        isHavePermisions = "manage" ; 
    }else{
        isHavePermisions = "user" ;
    }
    if(!emplLevels){
        throw new Error("Can`t find this user")
    }
    let emplInfo ;
    if(empl.aditionalInfo){
    emplInfo =   {
    name : empl.aditionalInfo.name,
    startDate : empl.startDate , 
    age : empl.aditionalInfo.age,
    nationalId : empl.aditionalInfo.nationalId,
    familyStatus : empl.aditionalInfo.familyStatus,
    birthDate : empl.aditionalInfo.birthDate,
    gender : empl.aditionalInfo.gender,
    children : empl.aditionalInfo.children,
    address : empl.aditionalInfo.adress,
    bankName : empl.aditionalInfo.bankName,
    iban : empl.aditionalInfo.iban }
}
    return {emplInfo , isHavePermisions}
}
exports.getEmplContract = async (companyName , id , user , index ) => {
    
    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : sanCompanyName}).select(`employees contracts`).lean();
    let contracts = company.contracts.filter(x => x.emplId == id).reverse();
    let maxContract = contracts.length;  
    let contract = contracts[index];
    let  isHavePermisions = "";
    let havePermisions  = false ; 
    let contractLevels = contract?.companyStructureStr?.split(`/`);
    if(!contractLevels){
        throw new Error("Can`t find this user")
    }
    let isDone = false; 
    user.permissions.forEach((x , i) => {
        if( !isDone && x.title.replaceAll(" ", '') == contractLevels[i].replaceAll(" ", '')){
            if(x.can.menage || x.can.admin){
                havePermisions = true;
                isDone = true ; 
            }
        }
        if(x.title.replaceAll(" ", '') != contractLevels[i].replaceAll(" ", '')){
            isDone = true;
        }
    })
    if(!havePermisions && contract.emplId != user._id ){
        throw new Error("You haven`t permissions for this user profile!")
    }
    if(havePermisions){
        isHavePermisions = "manage" ;
    }else{
        isHavePermisions = "user" ;
    }
    let emplContract =   {
    emplName : contract.emplName,
    emplId : contract.emplId , 
    startDate : contract.startDate ,
    endDate : contract.endDate ,
    grossSalary : contract.grossSalary
 }

    return {emplContract , isHavePermisions , maxContract}
}
exports.getEmplPayslip = async (companyName , id , user , index ) => {

    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : sanCompanyName}).select(`employees contracts`).lean();
    let contracts = company.contracts.filter(x => x.emplId == id).reverse();
    let payslips = [];
    contracts.forEach(x => {
        if(x.payslips.length > 0){
        let currPayslips = x.payslips.reverse();
        payslips = [...payslips , ...currPayslips]; 
        }
    })
    let maxPayslips = payslips.length;  
    let contract = contracts[0];
    let  isHavePermisions = false;
    let havePermisions  = false ; 
    let contractLevels = contract?.companyStructureStr?.split(`/`);
    if(!contractLevels){
        throw new Error("Can`t find this user")
    }
    let isDone = false; 
    user.permissions.forEach((x , i) => {
        if( !isDone && x.title == contractLevels[i]){
            if( x.can.admin){
                havePermisions = true;
                isDone = true ; 
            }
        }
        if(x.title != contractLevels[i]){
            isDone = true;
        }
    })
    if(!havePermisions && contract.emplId != user._id ){
        throw new Error("You haven`t permissions for this user profile!")
    }


    let emplPayslip = payslips[index];
    if(!emplPayslip){
        throw new Error("There are no payslips for this contract yet.")
    }
    emplPayslip.name = contract.emplName;
    emplPayslip.position = contract.position;
    emplPayslip.BaseSalary = contract.grossSalary;

    return {emplPayslip , isHavePermisions : havePermisions , maxPayslips}
}
exports.updateEmplInfo = async (companyName , id , data) => {

    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : sanCompanyName}).select(`employees`);

    let empl =  company.employees.find(x => x._id.toString() == id);
    

    empl.aditionalInfo.name = data.name ; 
    empl.aditionalInfo.age = data.age ;
    empl.aditionalInfo.nationalId = data.nationalId;
    empl.aditionalInfo.familyStatus = data.familyStatus
    empl.aditionalInfo.birthDate = data.birthDate;
    empl.aditionalInfo.gender = data.gender;
    empl.aditionalInfo.children = data.children;
    empl.aditionalInfo.adress = data.address;
    empl.aditionalInfo.bankName = data.bankName;
    empl.aditionalInfo.iban = data.iban;

    company.save()
    return 
}
exports.updateEmplContract = async (companyName , id , data) => {
    
    let sanCompanyName = companyName.replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : sanCompanyName}).select(`contracts`);
    let contracts = company.contracts.filter(x => x.emplId == id).reverse();
    let contract = contracts[0];


    contract.startDate = data.startDate;
    contract.endDate = data.endDate;
    contract.grossSalary = data.grossSalary; 

    company.save()
    return 
}
 exports.getNewContractData = async (compStr , id) => {
    let newStr =  compStr.replaceAll(` `,``).replaceAll(`%20`, '') ; 
    let companyArr = compStr.split(`/`);
    let companyName = companyArr[0].replaceAll(` `,``).replaceAll(`%20`, ''); 
    let company = await Company.findOne({name : companyName}).select(`hierarhchy contracts companyLevels`);
    if(!company){
     throw new Error(`No such company found!`)
    }
    let positionNames = this.getPositionNames(newStr , company.hierarhchy, company.companyLevels); 
    let currPosition = {};
    Object.keys(positionNames).forEach(x => {
        if(x.startsWith(`position`)){
            currPosition[x] = positionNames[x]
        }
    })
    let contract = company.contracts.find(x => {
        let date = new Date();
        // x.endDate  && Number(new Date(x.endDate)) > Number(date) &&
        if( x.emplId == id){
            return true
        }else{
            return false
        }
    })
    
    let contractData = this.getContractData(companyArr , company.hierarhchy, company.companyLevels ); 
    contractData.EmplName = contract.emplName ; 
    contractData.company = companyArr[0]; 
    contractData["POS"] = currPosition;
    contractData.grossSalary = contract.grossSalary;
  return contractData
 } 
exports.addEmployee = async (compStr , body) => {
    let newStr =  compStr ; 
    let companyArr = compStr.split(`/`);
    let companyName = companyArr[0].replaceAll(` `,``).replaceAll(`%20`, ''); ;
    let company = await Company.findOne({name : companyName}).select(`employees hierarhchy`);
    if(!company){
     throw new Error(`No such company found!`)
    }
    let names = body.emplNames.split(` `);
    let furstName = names[0];
    let lastName = names[names.length - 1];
    let newtimeString = Math.floor(Math.random()*200).toString()
    const hashedPassword = await bcript.hash(`newEmployee`,10) ;
    let permissions = this.getPermisions(newStr , company.hierarhchy , body.position);
    let newEpl = {
        email : furstName + lastName + newtimeString + `@` + companyName + `.com` ,
        password : hashedPassword ,
        HcmToken : ' ',
        startDate : body.startDate ,
        currentPosition : body.position,
        remainingPaidLeave : "20" ,
        isNewEmpl : true ,
        aditionalInfo : {
            name : body.emplNames,
            age : body.age,
            nationalId : body.nationalId,
            familyStatus : body.familyStatus,
            birthDate : body.birthDate,
            gender : body.gender,
            children : body.children,
            adress : body.emplAdress,
            bankName : body.bankName,
            iban : body.iban,
        }, 
        companyStructureLelev : compStr, 
        permissions : permissions , 
        contracts : []
    }
    company.employees.push(newEpl);
    await company.save();
    company = await Company.findOne({name : companyName}).select(`employees contracts`);
    let empl = company.employees[company.employees.length - 1]; 
    let newContract = {
        emplName : empl.aditionalInfo.name,
        emplId : empl._id,
        position : body.position,
        companyStructureStr : compStr,
        startDate : body.startDate ,
        endDate : body.endDate ,
        grossSalary : body.grossSalary,
        lastPayCheck : {
            overtimeHours : "0",
            overtimeHolydaysHour : "0",
            unpaidHours :"0",
            bonus : "0",
            sickLeaveDays : "0",
            anualLeaveDays : "0"
        },
        payslips : [],
    }
    company.contracts.push(newContract);
    await company.save();
    company = await Company.findOne({name : companyName}).select(`employees contracts`);
    let contractId = company.contracts[company.contracts.length - 1]._id ;
    company.employees[company.employees.length - 1].contracts.push(contractId.toString());
    await company.save();
    
  return {email : newEpl.email , password : "newEmployee"}
}
exports.addNewContract = async (compStr, body , id) =>{

    let newStr =  compStr ; 
    let companyArr = compStr.split(`/`);
    let companyName = companyArr[0].replaceAll(` `,``).replaceAll(`%20`, ''); ;
    let company = await Company.findOne({name : companyName}).select(`employees contracts hierarhchy`);
    if(!company){
     throw new Error(`No such company found!`)
    }

    let permissions = this.getPermisions(newStr , company.hierarhchy , body.position);
    let empl = company.employees.find(x => x._id == id);
    let oldContractId = empl.contracts[empl.contracts.length - 1];
    let oldContract = company.contracts.find( x => x._id == oldContractId._id.toString());
    oldContract.endDate = body.startDate;
    let newContract = {
        emplName : empl.aditionalInfo.name ,
        emplId : empl._id,
        position : body.position,
        companyStructureStr : compStr,
        startDate :  body.startDate,
        endDate :  body.endDate,
        grossSalary : body.grossSalary,
        lastPayCheck : {
            overtimeHours : `0`,
            overtimeHolydaysHour : `0`,
            unpaidHours :`0`,
            bonus : `0`,
            sickLeaveDays :`0`,
            anualLeaveDays : `0`,
        },
        payslips : []
    };
    company.contracts.push(newContract);
    await company.save();
    company = await Company.findOne({name : companyName}).select(`employees contracts`);
    empl = company.employees.find(x => x._id == id);
    let contractId = company.contracts[company.contracts.length - 1]._id;
    empl.contracts.push(contractId);
    empl.permissions = permissions;
    empl.companyStructureLelev = newStr; 
    empl.currentPosition = body.position ;
    await company.save();
  return 
}
exports.getContractData = (companyArr , hierarhchy, companyLevels ) => {
    let object = {}
    companyArr.forEach((x,i) => {
        if(i > 0){
            object[`STR${companyLevels[i]}`] = {}
            hierarhchy.sublevels.forEach((y, m ) => {
                object[`STR${companyLevels[i]}`][m] = y.name;
            })
        hierarhchy = hierarhchy.sublevels.find(x => x.name == companyArr[i]);
    }
        if(i == (companyArr.length - 1)){
            if(hierarhchy?.sublevels.length > 0){
                object[`SUB`] = {}
                hierarhchy.sublevels.forEach((z, n ) => {
                    object[`SUB`][n] = z.name;
                })
            }
        }
        
    })
    return object 
}
exports.getPermisions = (sanCompStr , hierarhchy , position ) => {
    let compArr = sanCompStr.split(`/`); 
    let currSt =  hierarhchy;
    let permisions = [];
    let thisPositions = [];
    compArr.forEach((x , i ) => {
        if(i == 0){
            thisPositions = currSt.directEmplPositions ;
        }else{  
            currSt = currSt?.sublevels.find( y => {
                return   y.name == x}) || [];
            if(currSt.directEmplPositions.length > 0){
                thisPositions = currSt.directEmplPositions;
    }}})
    permisions = thisPositions.find(x => x.title == position).permissions
    
  return permisions
}
exports.getCurrentEmplPoss =  (sanCompStr , hierarhchy, companyLevels ) => {
    let compArr = sanCompStr.split(`/`); 
    let CurStPositions = {title : '' , name : '' , positions : []};
    let currSt =  hierarhchy;

    compArr.forEach((x , i ) => {
        if(i == 0){
            CurStPositions.title = companyLevels[i];
            CurStPositions.name = currSt?.name
        }else{
            subStrNames.title = companyLevels[i];
            currSt = currSt?.sublevels?.find( y => y.name == x ) || [];
        }
    })
    CurStPositions.name = currSt.name
    if(currSt?.directEmplPositions && currSt?.directEmplPositions?.length > 0){
    CurStPositions.positions = currSt.directEmplPositions?.map( y => y.title);
    }

  return subStrNames
  return 
 } 
 exports.getPositionNames = (sanCompStr , hierarhchy , companyLevels ) => {
    let compArr = sanCompStr.split(`/`); 
    let positions = {};
    let currSt =  hierarhchy;
    let thisPositions = [];
    let name = '';
    let title = "";

    compArr.forEach((x , i ) => {
        if(i == 0){
            thisPositions = currSt.directEmplPositions ;
            name = currSt.name.replaceAll(` `, ``);
            title = companyLevels[i].replaceAll(` `, ``);
        }else{  
            title = companyLevels[i];
            currSt = currSt?.sublevels.find( y => {
                return   y.name.replaceAll(` `, ``) == x.replaceAll(` `, ``)}) || [];
            name = currSt.name;
            if(currSt.directEmplPositions && currSt.directEmplPositions.length > 0){
                thisPositions = currSt.directEmplPositions;
    }}})
    positions[`company`] = name + " " +title;
    thisPositions?.forEach((x,i)=>{
    positions[`position${i}`] = x.title;
    })
    

  return positions
 } 
 exports.getSubStrNames = (sanCompStr , hierarhchy , companyLevels) => {
  
    let compArr = sanCompStr.split(`/`); 
    let subStrNames = {title : '' , names : []}
    let currSt =  hierarhchy;
    compArr.forEach((x , i ) => {
        if(i == 0){
            subStrNames.title = companyLevels[i + 1]?.replaceAll(` `, ``) || "";
        }else{
            subStrNames.title = companyLevels[i + 1]?.replaceAll(` `, ``) || "";
            currSt = currSt?.sublevels?.find( y => {
                return   y.name?.replaceAll(` `, ``) == x?.replaceAll(` `, ``)}) || [];
        }
    })
    if(currSt?.sublevels && currSt?.sublevels?.length > 0 ){
        subStrNames.names = currSt.sublevels.map(y => y.name); 
    }

  return subStrNames
 } 
exports.getLastMounthPayments = (sanCompStr , contracts) => {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear() ;
    let grossSalaryPayment = 0 ;
    let totalPayment = 0 
    let thisContracts = contracts.filter(x => (x.companyStructureStr.replaceAll(` `, ``).startsWith(sanCompStr.replaceAll(` `, ``)))); 
    if(thisContracts?.length > 0){
    thisContracts.forEach( y => {
        thisPayslip = y.payslips?.find(z => (z.year == year && z.month == month ))
        if(thisPayslip){
        grossSalaryPayment = Number( Number(grossSalaryPayment) + Number(thisPayslip?.GrossPaytoEmpl)).toFixed(2);
        totalPayment = Number(Number(totalPayment) + Number(thisPayslip?.totalPay)).toFixed(2);}
    })
   }
   return {grossSalaryPayment , totalPayment}
}
exports.getCyrrentEmployesWithLastMonthSalary = (sanCompStr , contracts) => {
    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear() ;
    let CurrentLevelArr = []; 
   let thisContracts = contracts?.filter(x => (x.companyStructureStr.replaceAll(` `, ``) == sanCompStr.replaceAll(` `, ``)  && (x.endDate == '' || Number(new Date(x.endDate)) > Number(date)) && ( Number(new Date(x.startDate)) <  Number(date))   )); 

   if(thisContracts?.length > 0){
    thisContracts.forEach( y => {
        let curEmpl = {
            id : y.emplId,
            name : y.emplName , 
            position : y.position, 
            grossSalaryPayment : 0 ,
            totalPayment : 0,
            lastPayCheck : y.lastPayCheck,
            endDate : y.endDate
        }
        thisPayslip = y?.payslips?.find(z => (z.year == year && z.month == month ))
        if(thisPayslip){
        curEmpl.grossSalaryPayment =  thisPayslip?.GrossPaytoEmpl;
        curEmpl.totalPayment = thisPayslip.totalPay;
    }
    CurrentLevelArr.push(curEmpl); 
    })
   }
   return CurrentLevelArr
}
exports.addLastPaycheck = async (compStr , id , body) => {
    let newStr =  compStr.replaceAll(` `,``).replaceAll(`%20`, '') ; 
    let companyArr = newStr.split(`/`);
    let companyName = companyArr[0];
    let company = await Company.findOne({name : companyName}).select(`contracts`);
    if(!company){
     throw new Error(`No such company found!`)
    };
    let date = new Date()
    let contract =  company.contracts.find(x =>(x.emplId == id && (x.endDate == '' || Number(new Date(x.endDate)) > Number(date)) && ( Number(new Date(x.startDate)) <  Number(date))   )); 
    
    contract.lastPayCheck = body ; 

    await company.save();
    
   return
}
exports.setendDateToEmpl = async (compStr , id , body) => {
    let newStr =  compStr.replaceAll(` `,``).replaceAll(`%20`, '') ; 
    let companyArr = newStr.split(`/`);
    let companyName = companyArr[0];
    let company = await Company.findOne({name : companyName}).select(`contracts`);
    if(!company){
     throw new Error(`No such company found!`)
    };
    let date = new Date()
    let contract =  company.contracts.find(x =>(x.emplId == id && (x.endDate == '' || Number(new Date(x.endDate)) > Number(date)) && ( Number(new Date(x.startDate)) <  Number(date))   )); 
    if(contract){
    contract.endDate = body ; 
}
    await company.save();
    
   return
}

// auth

exports.addNewUser = async (email , password) => {
    
    let user = await User.findOne({email}) ;
    if(user){
        throw new Error (`This user is existing!`) ; 
    }

    // VALIDATE PASSWORD!!!!!!!!!!!!!!!
    if(password.length < 4){
        throw new Error (`Password length must be more 4 simbols!`) ; 
    }

    const hashedPassword = await bcript.hash(password ,10) ; 
    const currentUser = {email , name : "Admin", password : hashedPassword , HcmToken : '', permissions : [{title : "admin" , can : {admin : true}}]} ; 
    const newUser = await User.create(currentUser); 
    const token = await this.setToken(JSON.stringify({_id: newUser._id , permissions : newUser.permissions , name : newUser.name}));
    const upatedUser = await this.UpdateUser("HcmToken", token , newUser._id);
    return {...newUser.toObject(), "HcmToken" : token };
} ; 
exports.verifyUser = async(email , password) => {
    let companyName = email.split(`@`)[1].split(`.`)[0].toString();
    let company = await Company.findOne({name : companyName}).select(`employees companyLevels`).exec();
    if(!company){
        throw new Error(`Sorry, but this email is invalid.`)
    }
    let employees = company.employees;
    let newEmail = email.replace(`.bg` , '.com'); 
    
    const user = employees.find(x => x.email == newEmail);
    if(!user){
        throw new Error(`Sorry, but this email is invalid.`)
    }
    const validPass = await bcript.compare(password , user.password) ; 
    let userPermisions = user.permissions.filter((x, i ) => {
        if(x.title != company.companyLevels[i] || x.title == "admin"){
            return true
        }else {
            return false 
        }
    })

    let  newPermisions = [];
    let  isDone = false
    userPermisions.forEach(x => {

        if(!isDone){
            newPermisions.push(x);
        }
        if(x.can.admin || x.can.fill || x.can.menage || x.can.read){
            isDone = true; 
        }
    })
    let userData = {
        email : user.email ,
        permissions : newPermisions,
        HcmToken : user.HcmToken ,
        isNewEmpl : user.isNewEmpl ,
        _id :  user._id.toString() ,  
    }
    if(!user || !validPass){
        throw new Error(`Wrong password or email`)
    }
    return  {user : userData }
};
exports.setToken = async (user) => {
    
    const token = await jwt.sign(user , constants.secret ) ; 
    return token 
};
exports.UpdateToken = async (companyName   , token , _id) => {
    let company = await Company.findOne({name : companyName}).select(`employees`).exec();
    let empl = company.employees.find( x => x._id == _id);
    empl.HcmToken = token;
    company.save(); 
}
exports.removeToken = async (_id) => {
 let user = await User.findById(_id); 
 user.HcmToken = '';
 await user.save()
}
exports.getUser = async (email) => { 
    // const user = await Company.where('name').equals("admin").select("employees").findOne({email}).exec()
    const  user = await User.findOne({email}).lean();
    return  user

}
exports.changePassword = async (userId , newPassword ,companyName) => {
    let  name = companyName.replaceAll(` `, '');
    let company = await Company.findOne({name : name}).select(`employees`).exec();

    let empl = company.employees.find(x => x._id.toString() == userId );
    const hashedPassword = await bcript.hash(newPassword ,10) ; 
    empl.password = hashedPassword;
    empl.isNewEmpl = false ;
    await company.save() ; 
}

function getNames(companyHierarhchy , index , previousNamesArr){
    let i = 1  ; 
    let names = [];
    let currentLevel = {...companyHierarhchy}
    if(index == 0){
        return [companyHierarhchy?.name] ;
    }else{
        while(i <= index){
            if(currentLevel){
            currentLevel = currentLevel?.sublevels?.find(x => x.name == previousNamesArr[i]?.names[0]);}
            i++;
        }
    names = currentLevel?.map(x => x?.name);
    return names 
    }
    


}

// admin
exports.newCompany = async (companyObj) => {
    let name = companyObj.name.replaceAll(` ` , ``)
    let company = await Company.findOne({ name: name }).exec() ;
    if(company){
        throw new Error (`This company is existing!`) ; 
    }
    let newCompany = {...companyObj}; 
    const hashedPassword = await bcript.hash(`admin`,10) ; 
    newCompany.employees.push({
        email : `admin@${(name).trim()}.com`,
        password : hashedPassword,
        HcmToken : '',
        startDate : '0-0-0',
        currentPosition : 'admin',
        permissions :  [{
            title : name,
            can : {
                read : true , 
                fill : true ,  
                menage : true, 
                admin : true}}]
    })
    company = await Company.create(newCompany); 

    return {};
} ; 
