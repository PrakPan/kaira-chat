import * as actionTypes from './actionsTypes';
import axiosauthinstance from '../../services/user/auth'; 
import { setUserDetails } from './auth';
import * as ga from '../../services/ga/Index'
//Show spinner
export const authStartLoading = () => {
    return {
        type: actionTypes.AUTH_STARTLOADING
    }
}
//Otp sent succesfully
export const authSendOtp = () => {
   
    return {
        type: actionTypes.AUTH_OTPSENT
    };
};
//Inavlid mobile 
export const authMobileFail = (message) => {
    return {
        type: actionTypes.AUTH_MOBILEFAIL,
        mobilefailmessage: message
    }
}
//New user
export const newUser = () => {
    return {
        type: actionTypes.NEW_USER,
    }
}
export const getotp = (mobile) => {
    const authData = {
        "username": mobile
    } 
    ga.event({
        action: "number-login-request",
        params : {
          'status': ''
        }
      });
    return (dispatch) => {
        dispatch(authStartLoading()) //Show spinner
        axiosauthinstance.post("/initiate/", authData)
        .then(response => {
            if(response.data.message=="success"){
                ga.event({
                    action: "number-login-initiate",
                    params : {
                      'status': ''
                    }
                  });
                 dispatch(authSendOtp()); //Otp sent
                if(response.data.is_new_user ) dispatch(newUser()); //New user
                if(response.data.name) dispatch(setUserDetails({name:response.data.name }))
                if(response.data.email)  dispatch(setUserDetails({email:response.data.email }))
            }
            else dispatch(authMobileFail()); //Invalid mobile
        })
        .catch(err => {
            dispatch(authMobileFail(err.response.data.username[0])); //Invalid mobile
        });
    }
}
 