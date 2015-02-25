/**
 * Created with JetBrains WebStorm.
 * User: bogdan
 * Date: 1/16/15
 * Time: 11:29 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: bogdan
 * Date: 7/16/13
 * Time: 1:08 PM
 * To change this template use File | Settings | File Templates.
 */
$("#addform").validate({
    rules:{
        name:{
            required:true,
            minlength:4
        } ,
        user:{
            minlength:5 ,
            required:true
        },
        email:{
            required:true
        },
        password:{
            required:true,
            minlength:5
        } ,

        password2:{
            required:true,
            equalTo:"#password"
        }

    },
    messages:{
        user: {
            required:"Va rog sa supune-ti numele nume"

        },
        email: {
            required: "We need your email address to contact you",
            email: "Your email address must be in the format of name@domain.com"
        },
        password: {
            required:"Parola" ,
            minlength: "Plesdasd a min "
        },
        password_again:{
            equalTo: "Pleas retype same password"
        }
    },
    submitHandler:function(){
        alert("asd");
    },
    highlight:function(element,errorClass){
        $(element).closest('.form-control').removeClass('success').addClass('error');
        // $(element).parent().next().find("."+errorClass).removeClass("checked");
    },
    success:function(element){
        element.text('OK!').addClass('valid')
            .closest('.form-control').removeClass('error').addClass('success');
    }
});

