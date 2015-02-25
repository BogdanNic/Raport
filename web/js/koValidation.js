/**
 * Created by Bogdan on 26-Feb-15.
 */

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
//ko.extenders.numeric = function(target, precision) {
//    //create a writable computed observable to intercept writes to our observable
//    var result = ko.pureComputed({
//        read: target,  //always return the original observables value
//        write: function(newValue) {
//            var current = target(),
//                roundingMultiplier = Math.pow(10, precision),
//                newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue),
//                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
//
//            //only write if it changed
//            if (valueToWrite !== current) {
//                target(valueToWrite);
//            } else {
//                //if the rounded value is the same, but a different value was written, force a notification for the current field
//                if (newValue !== current) {
//                    target.notifySubscribers(valueToWrite);
//                }
//            }
//        }
//    }).extend({ notify: 'always' });
//
//    //initialize with current value to make sure it is rounded appropriately
//    result(target());
//
//    //return the new computed observable
//    return result;
//};
function wm(){
    var self=this;
    self.Username=ko.observable("asds").extend({logChange: "first name"});
    self.Books=ko.observable(2).extend({ numeric:"please add number "});
    this.firstName = ko.observable("name").extend({ required: "Please enter a first name" });
    this.lastName = ko.observable("last").extend({ required: "" });
}
ko.applyBindings(new wm());