import axios from "axios";
import { firebaseConfig } from "../firebase/firebase";

const config = {
  method: "post",
  url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
  headers: {
    "Content-Type": "application/json",
  },
};

export const PostAuthRegister = (data) => {
  var form = JSON.stringify({
    email: data.Email,
    password: "#$2021#$",
    returnSecureToken: true,
  });

  return new Promise((resolve, reject) => {
    axios
      .post(config.url, form, config)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
