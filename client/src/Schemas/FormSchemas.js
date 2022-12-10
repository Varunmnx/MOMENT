import * as yup from "yup";

const passwordRules = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const basicSchema = yup.object().shape({
    email :yup.string().email("enter a valid email").required("Requried"),
    password:yup.string().min(5).matches(passwordRules,{message:"Enter a stronger password"}).required("Required"),
    confirmPassword:yup.string().oneOf([yup.ref("password"),null],"Passwords must match").required("Required")
})