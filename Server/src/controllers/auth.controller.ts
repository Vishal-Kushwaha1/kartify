import { auth } from "../utils/auth.js";

export const verificationOTP = async () => {
  const data = await auth.api.sendVerificationOTP({
    body: {
      email: "vishalkrk4@gmail.com", //TODO: hardcoded value;
      type: "sign-in",
    },
  });
  console.log("data: ", data)
};

export const checkOTP= async()=>{
    const data = await auth.api.checkVerificationOTP({
        body:{
            email: "vishalkrk4@gmail.com",
            type:"sign-in",
            otp: "123456",
        }
    })
} 
