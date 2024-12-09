module.exports = (fn) =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};

//when api is called, this miidleware gets executed.This miidleware (wrapAsync)passes the api's callback as an argument, and returns this callback only if no errors are found after the callback gets executed.If there is error which ccurs then the catch block will be executed. error here can be an asynchronous error from the database due to invalid data entry during inserting the data of the form(for examplestoring string instead of number in price input after submission of the data.).