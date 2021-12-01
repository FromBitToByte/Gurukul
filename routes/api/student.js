const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../../middleware/authstudent");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const Meeting = require("../../models/Meeting");
const Discussion = require("../../models/Discussion");
const schedule = require("node-schedule");
const { route } = require("./teacher");
const nodemailer=require("nodemailer");
const moment = require("moment");
const router = express.Router();
const quesTime = 20000;
router.use(bodyParser.urlencoded({ extended: true }));

//Setting up Tranporter

const transporter = nodemailer.createTransport({
    service:'gmail', 
    auth:{
        user:'abhishekengage2021@gmail.com',
        pass:'Engage@2021'
    }  
});

router.get("/dashboard",auth,(req,res)=>{

    res.render("studentdashboard",{currentUser:req.user,
        clientType:req.session.client});


});  

router.get("/dashboard/test/enter",auth,async (req,res)=>{
    
    Meeting.findOne({roomId:req.query.room},async (err,meeting)=>{

        if(err) {
            throw Error(err);
        }
        if(err || !meeting){
            res.redirect("/student/dashboard?f=0"); 
        }
        else if(meeting.students.indexOf(req.user.email)===-1){
            res.redirect("/student/dashboard?f=0");
        }else{
            const errors=[];

            if(req.query.f==0){
               errors.push("You may enter the Room within 5 minutes after Scheduled Time only");
            }

            res.render("studenttestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,errors:errors});
        }
    });
});

function shuffle(array) {

    array.sort(() => Math.random() - 0.5);

}

router.get("/dashboard/entertestroom/:roomId",auth,async(req,res)=>{

   Meeting.findOne({roomId:req.params.roomId},async(err,meeting)=>{
        if(err){
            res.redirect("/student/dashboard");
        }
        if(meeting.students.indexOf(req.user.email)===-1){
            res.redirect("/student/dashboard");
        }
        else if( false && ((new Date()).getTime() < meeting.scheduledTime.getTime()) || ((new Date()).getTime()>(meeting.scheduledTime.getTime()+300000)) ){
           console.log("You can not enter test now or Either you are late by five minutes and you cannot enter test now.");
           res.redirect(`/student/dashboard/test/enter?room=${req.params.roomId}&f=0`); 
        } 
        else if (meeting.intestemail.indexOf(req.user.email)===-1) {
            const arr=meeting.questions;
            let correct=[];
            let visited=[];
            for(var i=0;i<arr.length;i++){
                correct.push(0);
                visited.push(0);
            }
            visited[0]=1;
            shuffle(arr);
            const obj={
                name:req.user.name,
                email:req.user.email,
                ques:arr,
                intime:Date.now(),
                correct:correct,
                visited:visited,
                currentQuestion:1
            }
            meeting.intestemail.push(req.user.email);
            meeting.intestdetails.push(obj);
            await meeting.save();
            let question1=obj.ques[0];
            res.render("maintestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,length:meeting.questions.length,runningquestion:1,question1:question1,repl:"Test is going on",times:21});
        }else{ 
            let x,y,repl="Test is going on ";
            await meeting.intestdetails.forEach(async (obj,index)=>{
                 if(obj.email===req.user.email){
                   await obj.ques.forEach((q,i)=>{
                       if(i===obj.currentQuestion-1){
                          
                         if(i==obj.ques.length-1){
                            y=obj.ques[i];
                            x=i;
                         }else{
                            y=obj.ques[i+1];
                            x=i+1;
                         }  
                       }
                       console.log("hi");
                       console.log(x);
                       if(obj.visited[x]==1){
                          repl="You had finished the test . LeaderBoard will be generated after all participants will finish the test";
                       }
                   });
                }
            });
            console.log(repl);
            res.render("maintestroom",{currentUser:req.user,clientType:req.session.client,meeting:meeting,length:meeting.questions.length,runningquestion:x,question1:y,repl:repl,times:21});
        }
   });

});


router.get("/dashboard/getquestion/:roomid/:email/:num",auth,(req,res)=>{

   Meeting.findOne({roomId:req.params.roomid},(err,meeting)=>{
      if(err){
          throw Error(err); 
      }else if(((new Date()).getTime() < meeting.scheduledTime.getTime()) || ((new Date()).getTime()>(meeting.scheduledTime.getTime()+meeting.questions.length*quesTime+300000)) ){
         res.redirect("/student/dashboard");
      }
      else if(meeting.students.indexOf(req.params.email)!==-1){
        if(meeting.intestemail.indexOf(req.params.email)!==-1){
            
            let q,ii=-1;
            meeting.intestdetails.forEach((p,indice)=>{
                if(p.email===req.params.email){
                    // q=p.ques;
                    ii=indice;
                }
            });
          
         if(ii!=-1){
          
           meeting.intestdetails[ii].ques.forEach((qq,j)=>{
                if(j==Number(req.params.num)-1){
                    q=qq;
                    meeting.intestdetails[ii].visited.set(j,1);
                    meeting.save().then((data)=>{
                    }).catch((e)=>{
                        console.log(e);
                    });
                }
           })
         }
        
        res.send({questionname:q.question,optionA:q.option1,optionB:q.option2,optionC:q.option3,optionD:q.option4,times:21})
           
        }else{
            res.redirect("/student/dashboard");
        }
      }else{
          res.redirect("/student/dashboard"); 
      }
   });

});

router.get("/dashboard/updatequestionnumber/:roomid/:email/:num",auth,(req,res)=>{

    Meeting.findOne({roomId:req.params.roomid},async (err,meeting)=>{
       if(err){
           throw Error(err);
       }else if(meeting.students.indexOf(req.params.email)!==-1){
           if(meeting.intestemail.indexOf(req.params.email)!==-1){
               let i=-1
               meeting.intestdetails.forEach(async (p,index)=>{
                   if(p.email===req.params.email){
                       i=index
                   }
               });
               if(i!==-1){
                   try{
                    meeting.intestdetails[i].currentQuestion=Number(req.params.num);
                    meeting.save().then((data)=>{
                        // console.log(data);
                    }).catch(e=>{
                        console.log(e);
                    }) 
                   }catch(e){ 
                       console.log(e);
                   } 
                   res.send({x:"Helo"})
               }
           }
       } 
    });  

});

router.get("/dashboard/updatemarks/:roomid/:email/:questionname/:answer",auth,(req,res)=>{

    Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
      if(err){
          throw Error(err);
      }else if(meeting.students.indexOf(req.params.email)!==-1){
         if(meeting.intestemail.indexOf(req.params.email)!==-1){

            let i=-1;
            meeting.intestdetails.forEach((p,index)=>{
                if(p.email===req.params.email){
                  i=index;
                }
            });

            if(i!==-1){
               let j=-1;
               let flag=0;
               meeting.intestdetails[i].ques.forEach((q,im)=>{
                    if(q.question == req.params.questionname){
                        j=im;
                        if(q.answer==req.params.answer){
                            flag=1;
                        }
                    }
               });
              

              if(j!=-1 && flag==1) {
                meeting.intestdetails[i].correct.set(j,1);
                meeting.save().then((data)=>{

                }).catch((e)=>{
                    console.log(e);
                })
              }else if(j!=-1 && flag==0){
                    meeting.intestdetails[i].correct.set(j,-1);
                    meeting.save().then((data)=>{

                    }).catch((e)=>{
                        console.log(e);
                    })
              }
            }
        }
      }
    });

});

router.get("/dashboard/leaderboard/:roomid",auth,async(req,res)=>{

    Student.find({},(err,users)=>{
    Meeting.findOne({roomId:req.params.roomid},async(err,meeting)=>{
        if(err){
            throw Error(err);
        }

         let students=meeting.students;
         let totalmarks=[];

         let names=[];
         await students.forEach(async(z)=>{
            await users.forEach((user)=>{
              if(z==user.email){
                names.push(user.name);
              }
            });
         });

         for(var i=0;i<students.length;i++){
           totalmarks.push(0);
         }
         let arr=[];
          meeting.questions.forEach((p,i)=>{
            let x=[];
            meeting.intestdetails.forEach((q,j)=>{
              q.ques.forEach((r,k)=>{
                  if(r.question == p.question && q.correct[k]==1){
                     x.push(q.email);
                  }
              });
            });

            x.forEach((y)=>{
                students.forEach((st,p)=>{
                    if(st==y){
                        totalmarks[p]=totalmarks[p]+1;
                    }
                })
            });
            arr.push(x);
          });
        

        res.send({students:students,totalmarks:totalmarks,arr:arr,names:names});
    });
  });

});

///////////////////////////////////////////////
            //Discusson Routes
///////////////////////////////////////////////


router.get("/dashboard/discussion/enter",auth,async(req,res)=>{

    Discussion.findOne({roomId:req.query.room},async (err,discussion)=>{
        if(err || !discussion){
            res.redirect("/student/dashboard?f=0");
        }
        if(discussion.students.findIndex(x=>x.email === req.query.user)===-1){
            res.redirect("/student/dashboard?f=0");
        }else{
            let errors=[];
            if(req.query.v==0){
              errors.push("Class has not started yet . Come at Scheduled Time");
            }
            res.render("studentdiscussionroom",{currentUser:req.user,clientType:req.session.client,discussion:discussion,texts:discussion.texts,errors:errors});
        }
    });

});

router.get("/dashboard/discussion/enter/classroom",async(req,res)=>{

    Discussion.findOne({roomId:req.query.room},(err,discussion)=>{
        if(err){
            throw Error(err);
        }
        if(discussion.students.findIndex(x=>x.email === req.query.email)===-1){
         res.redirect('/student/dashboard/discussion/enter?room'+req.params.room+'&user='+req.params.email+"&v=0");
        }else if( false && moment(new Date()) < moment(discussion.scheduledTime) ){
            console.log("Class has not started yet . Come at Scheduled Time");
            res.redirect("/student/dashboard/discussion/enter?room="+req.query.room+"&user="+req.query.email+"&v=0")
        }else {
            res.render("studentmainclassroom",{currentUser:req.user,clientType:req.session.client,discussion:discussion})
        }
    });

});

////////////////////////////////////////
 //Searching any student
///////////////////////////////////////
router.get("/profile/friend",auth,(req,res)=>{
   
    Student.findOne({email:req.query.email},(err,student)=>{
        if(student){
            Discussion.find({},async(err,discussions)=>{
                Meeting.find({},async(err,meetings)=>{
                    if(err){
                        throw Error(err);
                    }

                let attendance=[],graph=[];
    
                    let c=0;
                    await discussions.forEach(async (discussion)=>{
                        let y=discussion.students.findIndex(x => x.email == req.query.email);
                        if(y!==-1){
                            attendance.push(discussion);
                            if(discussion.students[y].present === true){
                                c=c+1;
                            }
                        }
                    });
                    
                    await meetings.forEach(async (meeting)=>{
                        let y = meeting.students.indexOf(req.query.email);
                        if(y!==-1){
                            graph.push(meeting);
                        }
                    });
                    
                    let test=[];
                    await graph.forEach(async(g)=>{
                        let x={
                        scheduledTime:g.scheduledTime,
                        roomId:g.roomId,
                        totalquestions:g.questions.length,
                        }
                    let y= g.intestdetails.findIndex(z=> z.email == req.query.email);
                    let count =0;
                    if( y === -1 ){
                        count = 0;
                    }else{
                        await g.intestdetails[y].correct.forEach((ee)=>{
                            if(ee==1){
                                count++;
                            }
                        });
                    }
                    
                    x.correct = count;
                    x.percentage = (count/(x.totalquestions)*(1.0))*100;
                    test.push(x);
                    });
                    
    
                    let present=[];
                    await attendance.forEach((at)=>{
                        let x={
                            scheduledTime:at.scheduledTime,
                            roomId:at.roomId,
                        }
                        let y=at.students.findIndex(z => z.email ==req.query.email);
                        if(at.students[y].present ==true){
                        x.present=true;
                        }else{
                        x.present=false;
                        }
                        present.push(x);
                    });
                
                let totalpercentagepresent= (c/(attendance.length)*(1.0))*100;
                res.render("friendprofile",{
                    currentUser:req.user,
                    clientType:req.session.client,
                    friendDetails:student,
                    present:present,
                    test:test,
                    totalpercentagepresentinclass:totalpercentagepresent
                }); 
                });
            });
     }else{
         res.redirect("/student/dashboard?f=2");
     }
    });

 });


 router.get("/profile/myprofile",auth,(req,res)=>{
   
    Student.findOne({email:req.query.email},(err,student)=>{
        if(student){
 
         Discussion.find({},async(err,discussions)=>{
             Meeting.find({},async(err,meetings)=>{
 
                 if(err){
                     throw Error(err);
                 }
 
                 let attendance=[],graph=[];
 
                 let c=0;
                     await discussions.forEach(async (discussion)=>{
                         let y=discussion.students.findIndex(x => x.email == req.query.email);
                         if(y!==-1){
                             attendance.push(discussion);
                             if(discussion.students[y].present === true){
                                 c=c+1;
                             }
                         }
                     });
                 
                     await meetings.forEach(async (meeting)=>{
                         let y = meeting.students.indexOf(req.query.email);
                         if(y!==-1){
                             graph.push(meeting);
                         }
                     });
                     
                 let test=[];
 
                 await graph.forEach(async(g)=>{
                     let x={
                         scheduledTime:g.scheduledTime,
                         roomId:g.roomId,
                         totalquestions:g.questions.length,
                     }
                     let y= g.intestdetails.findIndex(z=> z.email == req.query.email);
                     let count =0;
                     if( y === -1 ){
                         count = 0;
                     }else{
                        await g.intestdetails[y].correct.forEach((ee)=>{
                            if(ee==1){
                                count++;
                            }
                        });
                     }


                     
                     x.correct = count;
                     x.percentage = (count/(x.totalquestions)*(1.0))*100;
                     test.push(x);
                 });
                 
 
                 let present=[];
                 await attendance.forEach((at)=>{
                     let x={
                         scheduledTime:at.scheduledTime,
                         roomId:at.roomId,
                     }
                     let y=at.students.findIndex(z => z.email ==req.query.email);
                     if(at.students[y].present ==true){
                         x.present=true;
                     }else{
                         x.present=false;
                     }
                     present.push(x);
                 });
                 
                 let totalpercentagepresent= (c/(attendance.length)*(1.0))*100;
                 
                 let rewardPointsCalculated = 0;
                 await meetings.forEach(async ( meetObj)=>{

                    let y = meetObj.intestemail.findIndex( x => x.email = req.query.email);
                    if( y != -1 ){
                        Array.from(meetObj.intestdetails[y].correct ).forEach(async ( ansMarked )=>{
                            rewardPointsCalculated += ( ansMarked === 1 );
                        });
                    }
                });
                rewardPointsCalculated *= 10;

                 res.render("studentprofile",{
                         currentUser:req.user,
                         clientType:req.session.client,
                         present:present,
                         test:test,
                         rewardPoints : rewardPointsCalculated,
                         totalpercentagepresentinclass:totalpercentagepresent});
             });
         });
 
      }else{
          res.redirect("/student/dashboard?f=2");
      }
    });
    
 });


 router.get("/redeem", auth, (req, res) => {
    
    Student.findOne({ email: req.query.email }, (err, student) => {
        if (student) {
            if (err) {
                throw Error(err);
            }
            if( !student.rewardPoints )
                student.rewardPoints = 0;
            
            res.render("redeem", {
                currentUser: req.user,
                clientType: req.session.client,
                studRewardPoints : student.rewardPoints,
            });


        } else {
            res.redirect("/student/dashboard?f=2");
        }
    });

});

router.get("/redeem/goodie",auth,(req,res)=>{
    Student.findOne({ email: req.query.email }, (err, student) => {
        if (student) {
            if( student.rewardPoints === null ){
                student.rewardPoints = 0;
            }
            let requiredCoins = 0;
            if( req.query.goodieType === "pen" ){
                requiredCoins = 100;
            }else  if( req.query.goodieType === "tshirt" ){
                requiredCoins = 200;
            }else  if( req.query.goodieType === "bottle" ){
                requiredCoins = 250;
            }else  if( req.query.goodieType === "diary" ){
                requiredCoins = 300;
            }else  if( req.query.goodieType === "bag" ){
                requiredCoins = 500;
            }else  if( req.query.goodieType === "book" ){
                requiredCoins = 600;
            }else  if( req.query.goodieType === "ipad" ){
                requiredCoins = 2000;
            }else{
                requiredCoins = 5000;
            }
            
            if( student.rewardPoints < requiredCoins ){
                console.log( "Redeem Not Possible" );
            }else{
                student.rewardPoints = student.rewardPoints - requiredCoins;
                console.log( "Redeem Successful." );
            }

            student.save().then((data) => {
                console.log(student.rewardPoints );
            }).catch((e) => {
                console.log(e);
            });


            res.redirect("/student/dashboard?f=2");

        } else {
            res.redirect("/student/dashboard?f=2");
        }
    });
  
});


module.exports = router;
