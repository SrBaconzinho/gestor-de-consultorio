firebase.initializeApp(firebaseConfig);
function login() {
  showLoading();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email, password);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      hideLoading();
      window.location.href = "pages/home/home.html";
    })
    .catch((error) => {
      hideLoading();
      alert(errorMessage(error));
      hideLoading();
    });
}

function errorMessage(error) {
  if (
    error ==
    "FirebaseError: Firebase: The email address is badly formatted. (auth/invalid-email)."
  ) {
    return "E-mail em formatação errada";
  }
  if (
    error ==
    "FirebaseError: Firebase: The supplied auth credential is incorrect, malformed or has expired. (auth/invalid-credential)."
  ) {
    return "E-mail e/ou senha incorretos";
  }
  if (
    (error =
      "FirebaseError: Firebase: A non-empty password must be provided (auth/missing-password).")
  ) {
    return "insira a sua senha";
  } else {
    return error;
  }
}

function verifyEmail() {
  const email = document.getElementById("email").value;
  validateEmail(email);
  if (!validateEmail(email)) {
    document.getElementById("email-invalid-error").style.display = "flex";
  } else {
    document.getElementById("email-invalid-error").style.display = "none";
  }
}

function verifyPassword() {
  const password = document.getElementById("password").value.length;
  if (password < 6) {
    document.getElementById("password-required-error").style.display = "flex";
  } else {
    document.getElementById("password-required-error").style.display = "none";
  }
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
