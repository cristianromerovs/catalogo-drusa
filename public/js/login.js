firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // window.location.href = "http://www.google.com";
        alert("Login success");
    } else {
        alert("auth error");
    }
});

function login() {
    let userEmail = document.querySelector("#email__field").value;
    let userPassword = document.querySelector("#password__field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    
        window.alert("Error : " + errorMessage);
    
        // ...
      });
}