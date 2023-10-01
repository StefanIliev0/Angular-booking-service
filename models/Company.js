const mongoose = require(`mongoose`) ; 


const CompanySchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true ,`Name is reqired` ] , 
    } , 
    thisMounthAproved : {
         type : Boolean 
    },
    companyLevels : [{type : String}] ,
    hierarhchy : {
        name : {
            type : String ,
            required : true
        } ,
        subLevelDesc : {
            type : String 
        },
        sublevels : [{
            name : {
                type : String ,
                required : true
            } ,
            subLevelDesc : {
                type : String 
            },
            sublevels : [{
                name : {
                    type : String ,
                    required : true
                } ,
                subLevelDesc : {
                    type : String 
                },
                sublevels : [{
                    name : {
                        type : String ,
                        required : true
                    } ,
                    subLevelDesc : {
                        type : String 
                    },
                    sublevels : [{
                        name : {
                            type : String ,
                            required : true
                        } ,
                        directEmplPositions : [{
                            title : {
                                type : String , 
                                required : true
                            }, 
                            permissions :  [{
                                title : {
                                    type : String ,
                                    required : true, 
                                },
                                can : {
                                    read :{
                                        type :  Boolean ,
                                        required : false
                                } , 
                                    fill : {
                                        type :  Boolean ,
                                        required : false
                                } ,  
                                    menage : {
                                        type :  Boolean ,
                                        required : false
                                } , 
                                    admin : {
                                        type :  Boolean ,
                                        required : false
                                }}}]}]
                    }],
                    directEmplPositions : [{
                        title : {
                            type : String , 
                            required : true
                        }, 
                        permissions :  [{
                            title : {
                                type : String ,
                                required : true, 
                            },
                            can : {
                                read :{
                                    type :  Boolean ,
                                    required : false
                            } , 
                                fill : {
                                    type :  Boolean ,
                                    required : false
                            } ,  
                                menage : {
                                    type :  Boolean ,
                                    required : false
                            } , 
                                admin : {
                                    type :  Boolean ,
                                    required : false
                            }}}]}]
                }],
                directEmplPositions : [{
                    title : {
                        type : String , 
                        required : true
                    }, 
                    permissions :  [{
                        title : {
                            type : String ,
                            required : true, 
                        },
                        can : {
                            read :{
                                type :  Boolean ,
                                required : false
                        } , 
                            fill : {
                                type :  Boolean ,
                                required : false
                        } ,  
                            menage : {
                                type :  Boolean ,
                                required : false
                        } , 
                            admin : {
                                type :  Boolean ,
                                required : false
                        }}}]}]
            }],
            directEmplPositions : [{
                title : {
                    type : String , 
                    required : true
                }, 
                permissions :  [{
                    title : {
                        type : String ,
                        required : true, 
                    },
                    can : {
                        read :{
                            type :  Boolean ,
                            required : false
                    } , 
                        fill : {
                            type :  Boolean ,
                            required : false
                    } ,  
                        menage : {
                            type :  Boolean ,
                            required : false
                    } , 
                        admin : {
                            type :  Boolean ,
                            required : false
                    }}}]}]
        }],
        directEmplPositions : [{
            title : {
                type : String , 
                required : true
            }, 
            permissions :  [{
                title : {
                    type : String ,
                    required : true, 
                },
                can : {
                    read :{
                        type :  Boolean ,
                        required : false
                } , 
                    fill : {
                        type :  Boolean ,
                        required : false
                } ,  
                    menage : {
                        type :  Boolean ,
                        required : false
                } , 
                    admin : {
                        type :  Boolean ,
                        required : false
        }}}]}]
    }, 
    employees : [{
        email : {
            type : String ,
            required : true 
        },
        password : {
            type : String ,
            required : true 
        },
        HcmToken : {
            type : String ,
        },
        startDate : {
            type : String ,
        },
        currentPosition : {
            type : String 
        },
        isNewEmpl: {
            type : Boolean
        },
        remainingPaidLeave :{
            type : String ,
        },
        aditionalInfo : {
            name : {
                type : String , 
            },
            age : {
                type : String , 
            },
            nationalId : {
                type : String , 
            },
            familyStatus : {
                type : String , 
            },
            birthDate : {
                type : String , 
            },
            gender : {
                type : String , 
            },
            children : {
                type : String , 
            },
            adress : {
                type : String , 
            },
            bankName : {
                type : String , 
            },
            iban : {
                type : String , 
            },
        }, 
        companyStructureLelev : {
            type : String
        }, 
        permissions :  [{
            title : {
                type : String ,
                required : true, 
            },
            can : {
                read :{
                    type :  Boolean ,
                    required : false
            } , 
                fill : {
                    type :  Boolean ,
                    required : false
            } ,  
                menage : {
                    type :  Boolean ,
                    required : false
            } , 
                admin : {
                    type :  Boolean ,
                    required : false
        }}}],

        contracts : [{
            contractId : {
            type : String
        }}]
    }], 
    contracts : [{
        emplName : {
        type : String 
        },
        emplId : {
            type : String 
        },
        position : {
            type : String  
        },
        companyStructureStr : {
            type : String 
        },
        startDate : {
            type : String 
        },
        endDate : {
            type : String  
        },
        grossSalary : {
            type : String  
        },
        lastPayCheck : {
            overtimeHours : {
                type : String
            },
            overtimeHolydaysHour : {
                type : String
            },
            unpaidHours :{
                type : String
            },
            bonus : {
                type : String
            },
            sickLeaveDays : {
                type : String
            },
            anualLeaveDays : {
                type : String
            }
        },
        payslips : [{
            paymantDay : {
                type : String  
            },
            month : {
                type : String  
            },
            year : {
                type : String  
            },
            GrossPaytoEmpl : {
                type : String  
            },
            netPaytoEmpl : {
                type : String  
            },
            totalPay :{
                type : String  
            },
            overtimeHours : {
                type : String  
            },
            overtimeHolydaysHour : {
                type : String  
            },
            unpaidHours : {
                type : String  
            },
            bonus : {
                type : String  
            },
            sickLeaveDays : {
                type : String  
            },
            anualLeaveDays : {
                type : String  
            },
            childBenefits:{
                type : String  
            },
            taxes : {
                taxesForEmp : {
                    incomeTax: {
                        type : String 
                    },
                    SSC : {
                        type : String 
                    },
                    at : {
                        type : String 
                    }
                    },  
                taxesForEmpr : {
                    incomeTax: {
                        type : String 
                      },
                    SSC: {
                        type : String 
                      },
                    at: {
                        type : String 
                      }
                },
            }
        }],
        aditionalInfo : {
            type : String
        }
    }], 
    rules : {
          remuneration: {
            type : String ,
            required : true
          },
          workHours : {
            type : String ,
            required : true
          },
          paidAnnual :{
            type : String ,
            required : true
          }, 
          taxesForEmp : {
            incomeTax: {
                type : String 
              },
            SSC : {
                type : String 
              },
            at : {
                type : String 
              }
            },  
            taxesForEmpr : {
                incomeTax: {
                    type : String 
                  },
                SSC: {
                    type : String 
                  },
                at: {
                    type : String 
                  }
            },
            bonusesAsPercentages : [{
                type : String
            }],
            taxFreeBonusses :{
              coupons: {
                type : String ,
                required : true
              },
              child: {
                type : String ,
                required : true
              }
          } 
        }
})

const Company = mongoose.model(`Company` , CompanySchema) ; 

module.exports = Company;



// export type CompanyStructure = {
//     name : string,
//     title : string 
//     subLevelTitle? : string ,
//     sublevels? : [{
//         name : string ,
//         subLevelTitle? : string ,
//         sublevels? : [{
//             name : string  ,
//             subLevelTitle? : string ,
//             sublevels? : [{
//                 name : string ,
//                 subLevelTitle? : string,
//                 sublevels? : [{
//                     name :string ,
//                     directEmplPositions : [{
//                         title : string 
//                         permissions :  [{
//                             title : string,
//                             can : {
//                                 read? : boolean , 
//                                 fill? : boolean,  
//                                 menage? : boolean , 
//                                 admin? : boolean}
//                             }]}]
//                 }],
//                 directEmplPositions : [{
//                     title : string, 
//                     permissions :  [{
//                         title : string,
//                         can : {
//                             read? :boolean, 
//                             fill? : boolean,  
//                             menage? : boolean, 
//                             admin? : boolean}}
//                         ]}]}],
//             directEmplPositions : [{
//                 title : string 
//                 permissions :  [{
//                     title : string,
//                     can : {
//                         read? : boolean , 
//                         fill? : boolean,  
//                         menage? : boolean , 
//                         admin? : boolean}
//             }]}]
//         }],
//         directEmplPositions : [{
//             title : string 
//             permissions :  [{
//                 title : string,
//                 can : {
//                     read? : boolean , 
//                     fill? : boolean,  
//                     menage? : boolean , 
//                     admin? : boolean}
//                 }]}]
//     }],
//     directEmplPositions : [{
//         title : string 
//         permissions :  [{
//             title : string,
//             can : {
//                 read? : boolean , 
//                 fill? : boolean,  
//                 menage? : boolean , 
//                 admin? : boolean}
//             }]}]
// }