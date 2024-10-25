import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required"); //snadny zapis reusable casti kodu

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email adress"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"), //nazarazuji pozadavek na cisla a specialni znaky z duvodu pristupnosti
});

export type SignUpValues = z.infer<typeof signUpSchema>; //SignUpValues type je definovano z signUpSchema

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>; //LoginValues stejan logika jako u SignUpValues

export const createPostSchema = z.object({
  content: requiredString, //schema pro posts
});
