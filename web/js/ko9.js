/**
 * Created with JetBrains WebStorm.
 * User: bogdan
 * Date: 1/14/15
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: bogdan
 * Date: 7/8/13
 * Time: 10:12 PM
 * To change this template use File | Settings | File Templates.
 */
ko.extenders.numeric = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        if(newValue==""){
            target.hasError(true);
            target.validationMessage("Value is 0");
            return target;
        }else
        {
            var n1=parseInt(newValue,10);
            var n2=Number(newValue);
            if(isNaN(n1) ||isNaN(n2)) {
                target.hasError(true);
                target.validationMessage("This field is numberic");
                return target;
            }else{
                if((n1<0) || (10<n1) ) {
                    target.hasError(true);
                    target.validationMessage("Trebuie sa fie intre  0 si 10");
                    return target;

                }else{
                    target.hasError(false);
                    target.validationMessage("mulst be 1 to 10");
                    return target;
                }
            }
        }

    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};
ko.bindingHandlers.dateString = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        var d=valueUnwrapped;
        // s=d.getFullYear() ;
        // m=d.getMonth()+1 ;
        // day=d.getDate()  ;
        // var r=s+"-"+m+"-"+day;
        $(element).text(d.toDateString());
    }
}
ko.bindingHandlers.numberValueConvert={
    init:function(element, valueAccessor, allBindingsAccessor) {
          var value=valueAccessor();
        value(0);
        $(element).focus(function() {
            var value = valueAccessor();
            value(0);
        });
//         if($(element).val()===""){
//
//         }
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var value =ko.utils.unwrapObservable( valueAccessor());
          if(value===""){
              $(element).parent("td").addClass("warning");
              valueAccessor(0);
          }

    }
}
ko.bindingHandlers.datePicker={
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "changeDate", function(event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(event.date);
            }
        });
    },
    update: function(element, valueAccessor)   {
        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            if (widget.date) {
                widget.setValue();
            }
        }
    }
};

ko.bindingHandlers.bootstrapModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        vm.action = function() {
            vm.onAction();
        }
        ko.utils.toggleDomNodeCssClass(element, "modal  fade", true);
        ko.renderTemplate("myModal", vm, null, element);

        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
}
ko.bindingHandlers.bootstrapModalPrint = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        vm.action = function() {
            vm.onAction();
        }
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("myModalPrint", vm, null, element);

        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
}
myApp={};
myApp.isLogin=false;
    myApp.returnDate=function returnDate(date){

        var dateStr=date;
        var a=dateStr.split(" ");
        var d=a[0].split("-");
        if (a[1]!=undefined)
        {
            var t=a[1].split(":");
            var date = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
        } else{
            var date=new Date(d[0],(d[1]-1),d[2]);

        }


    return date;
};
myApp.sortDateAsc=function sortDateAsc(date1,date2){
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
};
myApp.monthNames = [ "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie" ];
(function netUtil($){

    var my2={};

    my2.send=function(obj,callback){

            var xmlhttp=new XMLHttpRequest();
            xmlhttp.open(obj.method,obj.urlLink,true);
            xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Authorization",obj.authToken);
            xmlhttp.send(obj.data);
            xmlhttp.onreadystatechange =function(){
                if (xmlhttp.readyState==4)
                {
                            debugger;

                            if(xmlhttp.status === 200 || xmlhttp.status === 201 ){
                                var d= xmlhttp.responseText;
                                var ds=JSON.parse(d);
                                switch(obj.type){

                                    case "Register":
                                        //debugger;

                                        callback.call(my2,ds);
                                        break;
                                    case "Login":
                                        callback.call(my2,ds);
                                        break;
                                    case "GetRaports":
                                        // localStorage.setItem("data",ds);
                                        //localStorage.setItem("isModified","false");
                                        callback.call(my2,{result:true,Raports:ds});
                                        break;
                                    case "Command":
                                        if(ds.error===false){
                                            callback.call(my2,true);
                                        }else{
                                            callback.call(my2,false);
                                        }
                                        break;
                                }

                            }
                }
            }
            xmlhttp.onerror=function(er){
                   debugger;
            }

        };
    myApp.util=my2;
    return my2;
})(jQuery);
(function netWorking(util) {
    //  var browserName = navigator.appName;


    var authToken = "0381bf51b21cf0e83536f9c662a0a371";
    var restLogin="http://bogdan.w.pw/v1/login";
    var restRegister="http://bogdan.w.pw/v1/register";
    var restBase="http://bogdan.w.pw/v1/raportsNew";
   // var restBase="http://bogdan.w.pw/v1/raports"

    var sampleData = 'username=bog&submit=Submit';
    var d;
    //bog qwerty34
    var user = "";
    var my = {};


    function createString(obj) {
        var s = "",name;
        for (name in obj) {
            if ((obj[name] !== null) & (obj[name] !== undefined))
                s += name + "=" + obj[name] + "&";
        }
        s += "submit=Submit";
        return s;
    }

    function post(stringToPost, url) {
        console.log(stringToPost + "\n " + url);
    }

    my.restApi=authToken;
    my.Login = function (username, password,callback) {
        //  var isTrue=post(username,password) ;
        var stringToPost = createString({username:username, password:password});
        post(stringToPost,restLogin);
        util.send({data:stringToPost,urlLink:restLogin,method:"POST",type:"Login"},function(result){
            // results=result;

            if(result.error===false){
                user=username;
                //alert(result.api_key);
                my.restApi=result.api_key;
                callback(result);
            }
        });

    };

    my.NewUser = function (name, username, password, email,callback) {
        var stringToPost = createString({name:name, username:username, password:password, email:email});
        post(stringToPost, restRegister);
        util.send({data:stringToPost,urlLink:restRegister,method:"POST",type:"Register"},function(result){
            // results=result;
            debugger;
            if(result.error===false){
                //user=username;
                ////alert(result.api_key);
                //my.restApi=result.api_key;
                callback(result);
            }
            else{
                alert(result.message);
            }
        });

    };
    my.GetData=function checkCode(){
        if(  util.raports.length>0){
            clearInterval(d);
            // alert(util.raports.length);
            return util.raports;
        }
    }
    my.ViewData = function (callback) {
        var raports=[];
        if(my.restApi===""){
            alert("rest api is o");
        }
        util .send({data:null,urlLink:restBase,method:"GET",authToken:my.restApi,type:"GetRaports"},function(result){
            callback(result);
        });
        return raports;
    };
    my.postRaportCommand=function(raportCommand,callback)
    {

        var endSubmit="&submit=Submit" ;
        var ra=raportCommand.luna;
        var name=ra.Username();
        var month=ra.Month();
        //var date2=new Date(month);
        var month2=ra.date.getMonth()+1;
        var stringDate=ra.date.getFullYear()+"-"+month2+"-"+ra.date.getDate();
        var dateLastUpdate=raportCommand.lastUpdate;
        var lastUpdateMonth=dateLastUpdate.getMonth()+1;
        var stringLastUpdate=dateLastUpdate.getFullYear()+"-"+lastUpdateMonth+"-"+dateLastUpdate.getDate()+" "+dateLastUpdate.getHours()+":"+dateLastUpdate.getMinutes();
        var url="";
        var method="";
        var lastUpdateInt=Math.floor(dateLastUpdate.getTime()/1000);
        var comm=raportCommand.command;
        switch (comm){
            case "DELETE":
               data="";

                method="DELETE";
                url=restBase+"/"+ra.ID()+"?lastUpdate="+lastUpdateInt+endSubmit;
                break;
            case "INSERT":
                data="user="+ra.Username()+"&"+"month="+stringDate+"&ore="+ra.Ore()+"&minute="+ra.Minute()+"&reviste="
                    +ra.Reviste()+"&brosuri="+ra.Brosuri()+"&carti="+ra.Carti()+"&studi="+ra.Studi()+"&visite="+
                    ra.Visite()+"&partener="+ra.Partener()+"&"+"lastUpdate="+lastUpdateInt+endSubmit;
                method="POST";
                url= restBase;
                break;
            case "UPDATE":
                data="id="+ra.ID()+"&"+"month="+stringDate+"&ore="+ra.Ore()+"&minute="+ra.Minute()+"&reviste="
                    +ra.Reviste()+"&brosuri="+ra.Brosuri()+"&carti="+ra.Carti()+"&studi="+ra.Studi()+"&visite="+ra.Visite()+
                    "&partener="+ra.Partener()+"&"+"lastUpdate="+lastUpdateInt+endSubmit;
                method="PUT";
                url= restBase+"/"+ra.ID();
                break;
        }
        post(data,url);
        util .send({data:data,urlLink:url,method:method,authToken:my.restApi,type:"Command"},function(result){
            callback(result);
            //return result;
        });
    }
    myApp.net=my;
    return my;
}(myApp.util));
(function(myApp){
    function Raport(data,date){
        //var self=this;
        this.Username =ko.observable(data.username);
        this.Partener =ko.observable(data.partener);
        this.ID       =ko.observable(data.id);
        this.Month    =ko.observable(data.month);
        this.Minute   =ko.observable(data.minute);
        this.Ore      =ko.observable(data.ore);
        this.Brosuri  =ko.observable(data.brosuri);
        this.Studi    =ko.observable(data.studi);
        this.Carti    =ko.observable(data.carti);
        this.Reviste  =ko.observable(data.reviste);
        this.Visite   =ko.observable(data.visite);
        // this.Luna=ko.computed(function(){
        //   return new Date(data.Month).getMonth();
        // });

        this.active=ko.observable(false);
        //expimental
        this.date=date;
    };
    myApp.Raport=Raport;
})(myApp);
//alt down alt up move up down
(function(myApp){
    function Modal(header,data,callback,primaryLabel){
        var self=this;

        self.header=ko.observable(header);

        self.body="sd";
        self.PrintColl=ko.observableArray([]);
        if(header!=='print'){

            self.username=ko.observable(data.Username());
            self.id=ko.observable(      data.ID());
            self.ore=ko.observable(     data.Ore());
            self.minute=ko.observable(  data.Minute());

            self.partner=ko.observable( data.Partener());
            self.visite = ko.observable(data.Visite()).extend({numeric: "numeric"});
            self.carti=ko.observable(   data.Carti()).extend({numeric:"numeric"});
            self.reviste=ko.observable( data.Reviste()).extend({numeric:"numeric"});
            self.studi=ko.observable(   data.Studi()).extend({numeric:"numeric"});
            self.brosuri=ko.observable( data.Brosuri()).extend({numeric:"numeric"});
            self.date=ko.observable(                 data.date);
            self.dateComp=data;

        }else {
            self.PrintColl(data);
            self.printCurrent=ko.observable();
            self.nameFriend=ko.observable();
        }
        self.closeLabel="Close";
        self.show= ko.observable(false);
        self.primaryLabel=primaryLabel;
        self.onClose= function() {
            // self.onModalClose();
            // myApp.RaportsViewModel.onModalAction();
            // callback(null,{ore:self.Ore(),date:self.date()});
        };
        self. onAction= function() {
            // self.onModalAction();
            self.show(false);
            if(header==="print"){
                callback(self.printCurrent);
            }   else{


                callback(new myApp.Raport({
                        id:self.id(),
                        ore:returnNumber(self.ore()),
                        minute:returnNumber(self.minute()),
                        username:self.username(),
                        partener:returnString(self.partner()),
                        carti:returnNumber(self.carti()),
                        reviste:returnNumber(self.reviste()),
                        brosuri:returnNumber(self.brosuri()),
                        visite:returnNumber(self.visite()),
                        studi:returnNumber(self.studi())},
                    self.date()));

            };
        }
    };
    function returnNumber(numberText){
        var number=0;
        if(numberText===""){
            return number;
        }
         var n1=parseInt(numberText,10)
        if(!isNaN(n1)){
               if(n1>=0){
                   number=n1;
               }

        }
        return   number;
    }
    function returnString(textString){
        var st="singur";
        if(textString===""){
            return st;
        }
        return textString;
    }
    myApp.Modal = Modal;
}(myApp));

(function(myApp){
    function RaportCommand(item,command,lastUpdate)   {
        this.luna=item;
        this.command=command;
        this.lastUpdate=lastUpdate;
    }
    myApp.RaportCommand=RaportCommand;
}(myApp));
//nu uita ; semicolen la sf
(function(myApp,net){
    "use strict";
    function BogFramework(){
        var self=this;

        // var listChanges=[];
        //TODO:make subscrber to anunte cand se schimba
        self.listChanges=ko.observableArray([]);
        self.RefreshTrue=ko.observable(0);

        this.insert=function insert(raport){
            self.listChanges.push(new myApp.RaportCommand(raport,"INSERT",new Date()));
        };
        this.delete = function deleteFct(raport) {
            var s = findId2(raport.ID());
            // debugger;
            if (s.length > 0) {
                var comm = s[0].command;
                switch (comm) {
                    case "INSERT":
                        self.listChanges.splice(self.listChanges.indexOf(s[0]), 1);
                        break;
                    case "UPDATE":
                        var pos = self.listChanges.indexOf(s[0]);
                        debugger;
                        self.listChanges.splice(pos, 1);
                        self.listChanges.push(new myApp.RaportCommand(raport, "DELETE",new Date()));
                        break;
                    case "DELETE":
                        alert("is deleted");
                        break;

                }
            } else {
                self.listChanges.push(new myApp.RaportCommand(raport, "DELETE",new Date()));
            }

        };
        this.update=function updateFct(raport)
        {

            var id=0;
// debugger;
            id =parseInt(raport.ID()) ;


            //  console.log(raport);
            if (id===NaN)
                alert("nan");
            //   alert(raport.Ore());
            var s=findId2(id);
            if (s.length>0){
                var comm=s[0].command;
                switch (comm){
                    case "INSERT":
                        self.listChanges.splice(self.listChanges.indexOf(s[0]),1,new myApp.RaportCommand(raport,"INSERT",new Date()));
                        break;
                    case "UPDATE":
                        self.listChanges.splice(self.listChanges.indexOf(s[0]),1,new myApp.RaportCommand(raport,"UPDATE",new Date()));
                        break;
                    case "DELETE":
                        break;

                }
            }  else {  self.listChanges.push(new myApp.RaportCommand(raport,"UPDATE",new Date()));}



        }

        function findId(id){
            for (var i = 0; i < self.listChanges().length; i++) {
                var obj = self.listChanges()[i];
                if(obj.luna.ID===id){
                    return true;
                }
            }
            return false;
        }
        function findId2(id)
        {
            var array2=[];
            //debugger;
            for (var i = 0; i < self.listChanges().length; i++) {
                var obj = self.listChanges()[i];
                var rp=0;
                rp=obj.luna.ID();
                if(parseInt(rp)===parseInt(id))
                {
                    // console.log(obj,"pt");
                    array2.push(obj);

                }
            }
            return array2;
        }
        this.execute1=function(){
            var arrayLength=self.listChanges().length;
            // listChangesObs.push(listChanges);
            // console.log(listChangesObs);
            nrTimes=parseInt(100/arrayLength,10);
            repeatNr=0;
            nrAcc=arrayLength;
            if(arrayLength>0){}
            {
                doRepeat(self.listChanges()[self.listChanges().length-1]);
            }

        }
        var nrAcc;
        var nrTimes;
        var repeatNr;
        function doRepeat(item){
            // nrAcc=10;

            console.log(item);
            net.postRaportCommand(item,function(result){
                if(result===true){
                    repeatNr++;

                    self.RefreshTrue(repeatNr*nrTimes);
                    console.log(repeatNr*nrTimes);
                    self.listChanges.pop();
                    var array2 = self.listChanges()[self.listChanges().length - 1];
                    // console.log(array2);
                    if(self.listChanges().length>0){
                        doRepeat(array2);
                    }else{
                        self.RefreshTrue(100);
                        alert("done");
                    }
                }else{
                    alert("error has happend");
                }
            });
        }

        var NrOfChangeAreToSend;
        var totalTimeExecutingFc,nrSendPost;
        this.getRaports=function(){
            return self.listChanges;
        } ;

    };
    myApp.BogFramework=BogFramework;
}(myApp,myApp.net));
(function(myApp){
    function User(name,password){
        this.name=ko.observable(name);
        this.password=ko.observable(password);
    }
    myApp.User=User;
}(myApp));
(function(myApp){
    "use strict";
    function TestBog(){
        "use strict";
        var vector=[];
        var self=this;
        self.nr=ko.observable(20);

        function send(name){
            vector.push(name);
        }

        this.methodBog=function(){
            alert("dasd");
        }
        // setTimeout( function(){ self.nr(2001)},20000);
    }
    myApp.TestBog=TestBog;
}(myApp));
(function(myApp,Parse){
    //TODO:parse
    "use strict";

    var parseBog={};


        var self=this;

    parseBog.name="";
    Object.defineProperty(parseBog, 'fullName', {
        get: function() {
            return "bog" + ' ' + "nic";
        },
        set: function(name) {
            parseBog.name=name;
            //var words = name.split(' ');
            //this.firstName = words[0] || '';
            //this.lastName = words[1] || '';
        }
    });
      // parseBog.currentUser=Parse.User.current();
       //parseBog.currentUser2=function(){
       //    var currentUser = Parse.User.current();
       //    if (currentUser) {
       //        // do stuff with the user
       //    } else {
       //        // show the signup or login page
       //    }
       //};
       parseBog.logOut=function(){
           Parse.User.logOut();
       };
       parseBog.signUp=function(username,password,email,callback){
           var user = new Parse.User();
           user.set("username", username);
           user.set("password", password);
           user.set("email", email);

// other fields can be set just like with Parse.Object
           user.set("phone", "415-392-0202");

           user.signUp(null, {
               success: function(user) {
                   // Hooray! Let them use the app now.
               },
               error: function(user, error) {
                   // Show the error message somewhere and let the user try again.
                   alert("Error: " + error.code + " " + error.message);
               }
           });
       };
       parseBog.login=function(username,password,callback){
           debugger;
           Parse.User.logIn(username,password, {
               success: function(user) {
                   // Do stuff after successful login.
                   alert("LogIn");
                   callback.call(parseBog,true);
               },
               error: function(user, error) {
                   // The login failed. Check error to see why.
                   alert(error);
                   callback.call(parseBog,false);
               }
           });
       };


    myApp.ParseBog=parseBog;

}(myApp,Parse));
(function(myApp,net,parse){
    function RaportsViewModel(){
        var self=this;
        self.name="bog5";
        var bigId=10000;
        var dateNow=new Date();
        var years=[];
        self.selectedRaport=ko.observable();
        self.raportsCollection=ko.observableArray([]);
        self.CurrentMonthView=myApp.monthNames[new Date().getMonth()];
        self.printCurrentMonth=ko.observable(new myApp.MonthView(myApp.monthNames[1]));
        var framework=new myApp.BogFramework();
        self.User=ko.observable(new myApp.User("",""));
        var USERNAME="";
        var rapCur=new myApp.Raport({Username:"boggfd",Ore:1,Minute:0,Partener:"vlad",Reviste:2,Visite:3,Carti:4,Studi:5,Brosuri:9, Month:"2001-2-2 12:12"},new Date());
        var rapNew=new myApp.Raport({username:"boggfd",ore:1,minute:0,partener:"",reviste:0,visite:0,carti:0,studi:0,brosuri:0, month:"2001-2-2 12:12"},new Date());
        var printNew=new myApp.Raport({Username:"boggfd",Ore:1,Minute:0,Partener:"",Reviste:0,Visite:0,Carti:0,Studi:0,Brosuri:0, Month:"2001-2-2 12:12"},new Date());

        self.editModal=new myApp.Modal("Edit your raport",rapCur,SaveEdit,"save edit");
        self.addRaport=new myApp.Modal("Add your raport",rapNew,SaveNewAdd,"add new");
        self.printRaport=new myApp.Modal("print",printNew,printRaportCommmand,"print");


        self.showProgress=ko.observable(false);
        self.progress=ko.observable(70);
        self.ProgressComputed=ko.computed(function(){
            return   self.progress()+"%";
        });
        framework.RefreshTrue.subscribe(function(progrees){


            self.progress(progrees);
            refresh();
            if(progrees>=99){
                self.showProgress(false);
            }
        });
        self.selected=ko.observable();
        self.PrintRaport=function(){
            var currentMonth=dateNow.getMonth(),
                currentYear=dateNow.getFullYear();
            var year=years.indexOf(currentYear);
            self.printCurrentMonth(new myApp.MonthView(myApp.monthNames[1]));
            self.printRaport.PrintColl(self.raportsCollection()[parseInt(year)].listView());
            self.printRaport.show(true);
        }
        function printRaportCommmand(printCurrent){

            // alert(printCurrent().luna);

            var divElement=document.getElementById("toPrint").innerHTML;
            var newPage=window.open("","PrintPreaview");
            newPage.document.styleSheets=[0];
            newPage.document.title="PrintPreavs";
            newPage.document.body.innerHTML="<html><body>"+
                divElement+"</body></html>";
            newPage.print();
            //window.print();
        }
        self.LogonUser=function(){
            var listNew=[];
            parse.name="alex";
            var d=parse.name;
            parse.login("marco2","123456",function(parseRes){
                debugger;
                //ok;
                var d=parseRes;
            });
            net.Login(self.User().name(),self.User().password(),function(result){
                console.log(result);
                if(result.error===false){

                   // GetMonthsYaer(result.Raports, listNew);
                    loadReports();
                }

            });
        };
        self.registerUser=function(){
            debugger;
          net.NewUser("name", "username", "password","email",function(result){
              debugger;

          });
        };

        function GetMonthsYaer(r, listNew) {
            for (var i = 0; i < r.length; i++) {
                var reportFromJson = r[i];

                var date1 = myApp.returnDate(reportFromJson.month);
                USERNAME=reportFromJson.username;
                if (years.indexOf(date1.getFullYear()) == -1) {
                    years.push(date1.getFullYear());
                }
                listNew.push(new myApp.Raport(reportFromJson, date1));
               if(reportFromJson.id>bigId){
                   bigId = reportFromJson.id;
               }

            }
            x(listNew);
        }
        // self.listChanges=ko.observableArray([]);
        // self.listChanges=framework.listChanges;
        self.listChanges=framework.listChanges;


        function refresh(){
            /* self.listChanges.removeAll();
             var vector=framework.getRaports();
             for (var i = 0; i < vector.length; i++) {
             self.listChanges.push(vector[i]);
             }*/
        }

        self.showModal = function() {
            self.editModal.show(true);
        }
        function SaveNewAdd(person){
            bigId++;
            var fullYearPerson = person.date.getFullYear();
            var year=years.indexOf(fullYearPerson);
            montc=person.date.getMonth();
            person.ID(bigId);
            var ore=person.Ore;

            if(year==-1){
                // alert("year not here");
                years.push(fullYearPerson);
                var listMonth=[];
                var vector=[];
                for (var i = 0; i < 12; i++) {

                    listMonth.push(new myApp.MonthView(myApp.monthNames[i],vector));
                }

                self.raportsCollection.push(new myApp.YearView(fullYearPerson,listMonth ));
            }
            // debugger;
            var year2=years.indexOf(fullYearPerson);
            //self.raportsCollection()[parseInt(year)].listView()[montc].list.push(new myApp.Raport({Ore:ore,Minute:person.Minute,Reviste:person.Reviste},person.date));
            self.raportsCollection()[parseInt(year2)].listView()[montc].list.push(person);
            console.log(person.Ore(),person.Username());
            //self.listChanges.push(person);
            framework.insert(person);
            refresh();

        }
        function SaveEdit(person){
            //  alert("SaveEdit");
            //alert(person.ore);
            // var year=  self.selectedRaport().date.getFullYear();
            var montc= self.selectedRaport().date.getMonth();

            var year=years.indexOf(self.selectedRaport().date.getFullYear());
            if(year==undefined){
                alert("SaveEdit");
            }
            if(montc==undefined){
                alert("sd2");

            }

            self.raportsCollection()[parseInt(year)].listView()[montc].list.remove(self.selectedRaport());

            var year=years.indexOf(person.date.getFullYear());
            montc=person.date.getMonth();
            var ore=person.Ore;
            //self.raportsCollection()[parseInt(year)].listView()[montc].list.push(new myApp.Raport({Ore:ore,Minute:person.Minute,Reviste:person.Reviste},person.date));
            self.raportsCollection()[parseInt(year)].listView()[montc].list.push(person);
            framework.update(person);
            refresh();

        }
        self.onModalClose = function(rest) {
            alert("CLOSE!+rest");
        }
        self.onModalAction = function() {
            ///alert("ACTION!");
        }


        var ProgressSum;
        var intervalProgressID;
        var progressNrSteps;
        self.SaveToDatabase=function(){
            //  var NrOfChanges=framework.getRaports();
            //    progressNrSteps=100/NrOfChanges.length;
            // //    console.log(progressNrSteps);
            //  self.progress(0);
            //  self.showProgress(true);

            framework.execute1();
            // intervalProgressID=setTimeout(progressStep,300);
            self.showProgress(true);
            self.progress(10);
            // refresh();
        }
        function progressStep(){
            var nr=framework.getRaports();
            console.log(nr.length);
            progressNrSteps--;
            debugger;
            if(nr.length===0){
                clearInterval(intervalProgressID);
                self.progress(100);
            } else{

                console.log(nr.length*progressNrSteps);
                self.progress(nr.length*progressNrSteps);
            }
        }





        self.EditRaport=function(rap){

            self. selectedRaport(rap) ;

            self.editModal.id(rap.ID());
            self.editModal.ore(rap.Ore());
            self.editModal.minute(rap.Minute());
            self.editModal.partner(rap.Partener());
            self.editModal.username(rap.Username());
            self.editModal.reviste(rap.Reviste());
            self.editModal.studi(rap.Studi());
            self.editModal.carti(rap.Carti());
            self.editModal.visite(rap.Visite());
            self.editModal.brosuri(rap.Brosuri());
            self.editModal.date(rap.date);
            self.editModal.show(true);

        };


        function loadReports() {
            var listNew = [];
            myApp.net.ViewData(function (r) {
                if (r !== "eror" || typeof r !== 'undefiled') {
                    GetMonthsYaer(r.Raports, listNew);
                }
            });
        }

        self.loadRaports=function(){
            loadReports();
        };
        function x(all){
            var list=[];
            for (var j = 0; j < years.length; j++) {
                list=getMonths(years[j],all);
                //  console.log(list);
                self.raportsCollection.push(new myApp.YearView(years[j],list));
                list=[];
            }
            var currentYear=self.raportsCollection().length-1;
            self.selected(self.raportsCollection()[currentYear]);
        }
        function getMonths(y,all){
            var list2=[],vector=[];
            for (var i = 0; i < 12; i++) {

                for (var j = 0; j < all.length; j++) {
                    var a=all[j];
                    if (a.date.getMonth()===i&& a.date.getFullYear()===y){
                        vector.push(a);
                        //  console.log(vector);
                    }
                }
                list2.push(new myApp.MonthView(myApp.monthNames[i],vector));
                vector=[];
            }
            return list2;
        }

        self.addNewRaport=function(){
            self.addRaport.id(222);
            self.addRaport.ore("");
            self.addRaport.partner("singur");
            self.addRaport.username(USERNAME);
            self.addRaport.reviste("");
            self.addRaport.studi("");
            self.addRaport.carti("");
            self.addRaport.visite("");
            self.addRaport.minute("");
            self.addRaport.brosuri("");
            self.addRaport.date(new Date());
            self.addRaport.show(true);
            //  var  obsd3={Username:"boggfd",Ore:1,Minute:0,Reviste:2, Month:"2001-2-2 12:12"};
            //  var p=new myApp.Raport(obsd3,new Date());
            //  self.raportsCollection.push(p)  ;
            //   self.selectedRaport(p);
            ///   var year=years.indexOf(2013);
            ///   var c= p.date.getMonth();
            ///  self.raportsCollection()[parseInt(year)].listView()[c].list.push(p);
            // console.log(self.raportsCollection()[1].listView()[6].list.push(p));
        };
        self.saveRaport=function(){
            var p=self.selectedRaport();
            if(!p){return};
            if(self.raportsCollection.indexOf(p)>-1){
                return;
            };
            self.raportsCollection.push(p);
            self.selectedRaport(null);
        };
        self.removeProduct = function (rap) {

            var year=years.indexOf(rap.date.getFullYear());
            var c= rap.date.getMonth();
            var p = self.selectedRaport();

            self.selectedRaport(null);

            self.raportsCollection()[parseInt(year)].listView()[c].list.remove(rap);
            framework.delete(rap);
            refresh();
        };
    }
    myApp.RaportsViewModel= RaportsViewModel;
})(myApp,myApp.net,myApp.ParseBog);

(function (myApp){
    function MonthView(luna,vector){
        var self=this;
        var s1=0;
        self.luna=luna;
        self.hours=ko.observable(0);
        self.list=ko.observableArray(vector);
        self.detail=ko.observable(false);
        self.SumMin=ko.computed(function(){
            var total=0;
            var min=0;
            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Minute()) ;
            min=calcHours(total);
            return min;
        } );
        function calcHours(minute){
            var i=0;
            while(minute>59){
                minute=minute-60;
                i++;
            }
            self.hours(i);
            return minute;

        }
        self.SumOre=ko.computed(function(){
            var total=0;

            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Ore()) ;
            total+=self.hours();
            return total;
        } );
        self.SumReviste=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Reviste()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumBrosuri=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Brosuri()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumVisite=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Visite()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumCarti=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.list().length; i++)
                total+=parseInt(self.list()[i].Carti()) ;
            // total+=self.hours();
            return total;
        } );
        self.enableDetail=function(){
            self.detail(true);
        }
        self.disableDetail=function(){
            self.detail(false);
        }
    }
    myApp.MonthView=MonthView;
})(myApp);

(function(myApp){
    function YearView(year,listView){
        var  self=this;
        this.year=year;
        this.listView=ko.observableArray(listView);
        self.detail=ko.observable(false);
        var date=new Date();
        if (year==date.getFullYear()) {
            self.detail(true);
        }
        self.enableDetail=function(){
            self.detail(true);
            console.log(self.detail); debugger;

        }
        self.disableDetail=function(){
            self.detail(false);
            if   ( self.detail()==false)
                self.detail(true);
            console.log("detail",self.detail());
            debugger;
        }
        self.isVisible=function(){
            if   ( self.detail()==false)
                self.detail(true);

            $("#listWiew").slice();
        }
        self.hideVisible=function(){

            // self.detail(false);
            self.detail(!self.detail);

        }
        self.viewVisible=function(){
            self.detail(true);
        }

        self.SumOre=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.listView().length; i++)
                total+=parseInt(self.listView()[i].SumOre()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumVisite=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.listView().length; i++)
                total+=parseInt(self.listView()[i].SumVisite()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumBrosuri=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.listView().length; i++)
                total+=parseInt(self.listView()[i].SumBrosuri()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumReviste=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.listView().length; i++)
                total+=parseInt(self.listView()[i].SumReviste()) ;
            // total+=self.hours();
            return total;
        } );
        self.SumCarti=ko.computed(function(){
            var total=0;
            for (var i = 0; i <self.listView().length; i++)
                total+=parseInt(self.listView()[i].SumCarti()) ;
            // total+=self.hours();
            return total;
        } );

    }
    myApp.YearView=YearView;
})(myApp);

(function(myApp){
    function App(){
        this.run=function(){
            var vm=new myApp.RaportsViewModel();
            ko.applyBindings(vm);
        };
    }
    myApp.App=App ;
})(myApp);

