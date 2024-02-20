


const messageMeDb = firebase.database().ref("users");
const storedUsername = localStorage.getItem("usernameMessage");
const storedUserID = localStorage.getItem("useridMessage");
const storedPasswordInd = localStorage.getItem("passwordMessage");
    messageMeDb
    .orderByChild("id")
    .equalTo(storedUserID)
    .once("value", (snapshot) => {
        if (snapshot.exists()) {
            let userFound = false;
            snapshot.forEach((user) => {
                const storedDbPassword = user.val().password;
                const storedDbUsername = user.val().name;
                if (storedPasswordInd === storedDbPassword && storedUsername === storedDbUsername) {
                    userFound = true;
                }
            });
            if (userFound) {
                window.location.href = "message.htm";
               
            } 
        }
    });
