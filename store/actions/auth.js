import * as actionTypes from './actionsTypes';
import axios from 'axios'; 
import axiosauthinstance from '../../services/user/auth';
import axiosgoogleauthinstance from '../../services/user/googleAuth';
import axiosfbauthinstance from '../../services/user/fbAuth';
import axiosuserinstance from '../../services/user/info';
import * as ga from '../../services/ga/Index';
//Open login modal
export const authShowLogin = () => {

    return{
        type: actionTypes.AUTH_SHOWLOGIN
    }
}

//Close login modal
export const authCloseLogin = () => {
    return{
        type: actionTypes.AUTH_CLOSELOGIN
    }
}
//Show spinner
export const authStartLoading = () =>{
    return{
        type: actionTypes.AUTH_STARTLOADING
    }
}
//Show spinner for social login
export const authStartLoadingSocial = () =>{
    return{
        type: actionTypes.AUTH_STARTLOADINGSOCIAL
    }
}
export const authStopLoadingSocial = () =>{
    return{
        type: actionTypes.AUTH_STOPLOADINGSOCIAL
    }
}
//Store token on sucess
export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        access_token: token,
    }; 
};
//Set user name and email
export const setUserDetails = (userdetails) => {
     try{
        localStorage.setItem('email', userdetails.email);
    }catch{

    }
    return {
        type: actionTypes.AUTH_SETUSERDETAILS,
        data: userdetails,
    }
}
//set profile pic
export const setProiflePic = (value) => {
    return {
        type: actionTypes.AUTH_SETPROFILE_PIC,
    }
}
//Wrong OTP
export const authOtpFail = (error) => {
    return {
        type: actionTypes.AUTH_OTPFAIL,
        error: error
    };
};
//Email already in use 
export const authEmailFail = (message) => {
    return{
        type: actionTypes.AUTH_EMAILFAIL,
        emailfailmessage: message
    }
}
//Invalid phone or already taken 
export const authMobileFail = (message) => {
    return {
        type: actionTypes.AUTH_MOBILEFAIL,
        mobilefailmessage: message,

    }
}
//Unused
export const authResetEmail = () => {
    return{
        type: actionTypes.AUTH_RESETEMAIL,
    }
}
export const authResetOtpFail = () => {
    return{
        type: actionTypes.AUTH_RESETOTPFAIL,
    }
}
//Clear auth data
export const authLogout = () => {
    return{
        type: actionTypes.AUTH_LOGOUT,
    }
}
//Logout / refresh after token expires
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime * 1000)
        
    }
}
//Auth check status for checkAuthRedirect HOC
export const authCheckCompleted = () => {
    return{
        type: actionTypes.AUTH_CHECKAUTHCOMPLETED,
    }
}
export const authSetLoginMessage = (message) => {
    return{
        type: actionTypes.AUTH_SETLOGINMESSAGE,
        loginmessage: message
    }
}
export const authHideLoginClose = () =>{
    return{
        type: actionTypes.AUTH_HIDELOGINCLOSE,
    }
}
//Check auth state
export const checkAuthState = () => {
    
    return dispatch => {
        const access_token = localStorage.getItem('access_token');
 
         //No token present, Auth check completed (for checkAuth HOC)
        if(!access_token){
             dispatch(authCheckCompleted());
            dispatch(authLogout()); //Clear auth status in redux if any
        }
        else{
 
            //Token expired
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                  dispatch(authLogout());
                //refresh token
            }
            //Token valid
            else{

 
                const userdata = {
                    name: localStorage.getItem('name'),
                    phone: localStorage.getItem('phone'),
                    email: localStorage.getItem('email'),
                    id: localStorage.getItem('user_id'),
                    image: localStorage.getItem('user_image'),
                }
                 //Update redux with token and user details 
                dispatch(authSuccess(access_token));
                dispatch(setUserDetails(userdata));
                //Start logout /refresh  timer -> logout /refresh  after new token expiration time
                dispatch( checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
                //Auth check completed (for checkAuth HOC)
                dispatch(authCheckCompleted())
            }
        }
    }
}
//Set path to redirect on successfull auth
export const setAuthRedirect = (path) => {
    return {
         type: actionTypes.AUTH_SETAUTHREDIRECT,
         path: path,  
    }
}

export const auth = (mobile, password, name, email, whatsapp) => {
    //name and email null incase of old user

    const authData = {
        "grant_type": "password",
        "username": mobile,
        "password": password,
        "client_id": "59Fj160UxJ4LJ1fyu20nsxzbyGhpWXHaIqmUMCVJ",
        "client_secret": "5k5E6w6nqaMxwxaJunZq14lzv84CNZ434YIlJlEmOwZzX6UU0DDY3dlgv88qpqTgQjkcVm3fmN38eZNfZ9BsfpEGGJ84g5LKjie8xbDFYvnb3k7Nu02xx8SAxRTvExT2",
        "otp": true,
        "name": name,
        "email": email,  
    }
    return (dispatch, getState) => {
            dispatch(authStartLoading()); //Start spinner
            dispatch(authResetOtpFail()); //Set otp fail false
            let updatedauthdata={...authData};
            if(getState().auth.newUser) updatedauthdata={...updatedauthdata, is_new_user: true, whatsapp_opt_in: whatsapp}
            axiosauthinstance.post("/complete/", updatedauthdata)
            .then(response => {

                if(response.status === 200){
                    ga.event({
                        action: "number-login-success",
                        params : {
                          'status': 'otp verified'
                        }
                      });
                    const userdata = {
                        name: response.data.name,
                        phone: response.data.phone,
                        email: response.data.email,
                        id: response.data.id,
                        image: response.data.profile_pic,
                    }
                    //Store user details in local storage
                    localStorage.setItem('name', userdata.name);
                    localStorage.setItem('email', userdata.email);
                    localStorage.setItem('phone', userdata.phone);
                    localStorage.setItem('user_id', userdata.id);
                    localStorage.setItem('user_image', userdata.image)

                    //Store token expiration date in local storage
                    const expirationDate = new Date(new Date().getTime() + response.data.oauth.expires_in * 1000);
                    dispatch(authSuccess(response.data.oauth.access_token));    //Store token
                    dispatch(setUserDetails(userdata))  //Store user name and email
                    dispatch(checkAuthTimeout(response.data.oauth.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
                    dispatch(authCloseLogin()); //close login modal
                    //store token details in local storage
                    localStorage.setItem('access_token',response.data.oauth.access_token);
                    localStorage.setItem('expirationDate', expirationDate);
                }

            })
            .catch(err => {
                
                if(err.response.data.email){
                    ga.event({
                        action: "number-login-email_fail",
                        params : {
                          'status': 'email fail'
                        }
                      });
                 dispatch(authEmailFail(err.response.data.email[0]));
                }
                else{
                    ga.event({
                        action: "number-login-otp_fail",
                        params : {
                          'status': 'otp fail'
                        }
                      });
                    dispatch(authOtpFail())
                }
            });
    }
}
export const googleAuth = (response) => {

    ga.event({
        action: "google-login-initiate",
        params : {
          'status': ''
        }
      });
    return (dispatch) => {
        dispatch(authStartLoadingSocial()); //Start spinner

    axiosgoogleauthinstance.get('?access_token='+response.accessToken).then( res =>{
        dispatch(authStopLoadingSocial());
        if(res.status === 200){
            ga.event({
                action: "google-login-success",
                params : {
                  'status': ''
                }
              });
            const userdata = {
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                id: res.data.id,
                image: res.data.profile_pic

            }
            if(!res.data.phone) dispatch(authSetLoginMessage('Confirm your phone number'))
             //Store user details in local storage
            localStorage.setItem('name', userdata.name);
            localStorage.setItem('email', userdata.email);
            localStorage.setItem('phone', userdata.phone);
            localStorage.setItem('user_id', userdata.id);
            localStorage.setItem('user_image', userdata.image)

            //Store token expiration date in local storage
            const expirationDate = new Date(new Date().getTime() + res.data.oauth.expires_in * 1000);
            dispatch(authSuccess(res.data.oauth.access_token));    //Store token
            dispatch(setUserDetails(userdata))  //Store user name and email
            dispatch(checkAuthTimeout(res.data.oauth.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
            dispatch(authHideLoginClose())
            //dispacth close login if mobile returned
            // dispatch(authCloseLogin()); 
            
            //store token details in local storage
            localStorage.setItem('access_token',res.data.oauth.access_token);
            localStorage.setItem('expirationDate', expirationDate);
        }
    }
    ).catch(err => {
        dispatch(authStopLoadingSocial)
    })
    }
}
export const fbAuth = (response) => {
    return (dispatch) => {
    dispatch(authStartLoadingSocial()); //Start spinner
    axiosfbauthinstance.get('?access_token='+response.accessToken).then( res =>{

        if(res.status === 200){
            const userdata = {
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                id: res.data.id,
                image: res.data.profile_pic

            }
            //Store user details in local storage
            localStorage.setItem('name', userdata.name);
            localStorage.setItem('email', userdata.email);
            localStorage.setItem('phone', userdata.phone);
            localStorage.setItem('user_id', userdata.id);
            localStorage.setItem('user_image', userdata.image)

            
            //Store token expiration date in local storage
            const expirationDate = new Date(new Date().getTime() + res.data.oauth.expires_in * 1000);
            dispatch(authSuccess(res.data.oauth.access_token));    //Store token
            dispatch(setUserDetails(userdata))  //Store user name and email
            dispatch(checkAuthTimeout(res.data.oauth.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
            dispatch(authCloseLogin()); //close login modal
            //store token details in local storage
            localStorage.setItem('access_token',res.data.oauth.access_token);
            localStorage.setItem('expirationDate', expirationDate);
        }
    }
    )
    }
}
export const authResetLogin = () => {
    return{
        type: actionTypes.AUTH_RESETLOGIN
    }
}
export const changeUserDetails = (userdetails) => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        axiosuserinstance.patch("/info/", userdetails, {headers: {
            'Authorization': `Bearer ${token}`
            }}).then(res => {
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('phone', res.data.phone);
                dispatch(setUserDetails(userdetails));
                dispatch(authSetLoginMessage(null))
                dispatch(authCloseLogin());

            }).catch(err => {
                    //set error
                    if(err.response.data.phone) dispatch(authMobileFail(err.response.data.phone[0])); //Invalid / already taken  mobile

                    else dispatch(authMobileFail()); //Invalid / already taken  mobile
            })
        
    }
}
 
export const uploadProfilePic = (image) => {
    return (dispatch, getState) => {
        const token = getState().auth.token;
        axiosuserinstance.patch("/profile_pic/upload/", {'profile_pic': image}, {headers: {
            'Authorization': `Bearer ${token}`
            }}).then(res => {
                dispatch(setProiflePic(true));
            }).catch(err => {
                    //set error
                dispatch(setProiflePic(true));
            })
        
    }
}