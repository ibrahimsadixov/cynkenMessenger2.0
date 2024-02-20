const storedUsername = localStorage.getItem("usernameMessage");
const storedUserID = localStorage.getItem("useridMessage");

if (!storedUsername || !storedPassword || !storedUserID) {
    window.location.href = "index.htm";
} else {
    messageMeDb
        .orderByChild("id")
        .equalTo(storedUserID)
        .once("value", (snapshot) => {
            if (snapshot.exists()) {
                let userFound = false;
                snapshot.forEach((user) => {
                    const storedDbPassword = user.val().password;
                    const storedDbUsername = user.val().name;
                    if (storedPassword === storedDbPassword && storedUsername === storedDbUsername) {
                        userFound = true;
                    }
                });
                if (!userFound) {
                   
                    window.location.href = "index.htm";
                } 
            } else {
               
                window.location.href = "index.htm";
            }
        });
}
