/**
 * Created by Bogdan on 26-Feb-15.
 */
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})
ko.extenders.logChange = function(target, option) {
    target.subscribe(function(newValue) {
        console.log(option + ": " + newValue);
    });
    return target;
};
ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        target.hasError(newValue ? false : true);
        target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};
ko.extenders.numeric = function(target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
    target.message=options.overrideMessage +options.min+" to " + options.max;
    //define a function to do validation
    function validate(newValue) {
        if(newValue==""){
             target.hasError(true);
             target.validationMessage(options.overrideMessage);
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
                if((n1<options.min) || (n1>options.max) ) {
                    target.hasError(true);
                    target.validationMessage("Trebuie sa fie intre  "+options.min+" si "+options.max);
                    return target;

                }else{
                    target.hasError(false);
                    target.validationMessage("all is OK!");
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

function wm(){
    var self=this;
    self.name = ko.observable("Buffy");
    self.title = ko.observable("The Vampire Slayer");
    self.nameAndTitle = ko.computed({
        read: function(){ return self.name() + ", " + self.title();},
        write: function(value){
            var nameAndTitle = value.split(', ');
            self.name(nameAndTitle[0]);
            self.title(nameAndTitle[1]);
        }
    });
    self.newName = ko.observable('Planet');
    self.oldName = ko.observable('Earth');

    self.fullName = ko.computed({
        read: function(){ return self.newName() + ", " + self.oldName();},
        write: function(value){
            var nameAndTitle = value.split(', ');
            self.newName(nameAndTitle[0]);
            self.oldName(nameAndTitle[1]);
        }


    });

    self.Username=ko.observable("asds").extend({logChange: "first name"});
    self.Books=ko.observable(2).extend({ numeric:{overrideMessage:"Numeric from",min:0, max:10}});
    this.firstName = ko.observable("name").extend({ required: "Please enter a first name" });
    this.lastName = ko.observable("last").extend({ required: "" });
    this.status=ko.computed(function(hasError){
        return  hasError?"has-error":"has-success ";
    });
}
ko.applyBindings(new wm());