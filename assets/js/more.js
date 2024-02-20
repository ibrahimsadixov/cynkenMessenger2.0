const more = document.getElementById("more");
const moreDiv = document.querySelector(".moreDiv");
const logOut = document.getElementById("logOut");

more.addEventListener("click", (event) => {
    event.stopPropagation(); 
    moreDiv.classList.toggle("moreDivActive");
});

logOut.addEventListener("click", () => {
    localStorage.removeItem("usernameMessage");
    localStorage.removeItem("passwordMessage");
    window.location.href = "index.htm";
});

document.addEventListener("click", (event) => {
    const target = event.target;

    if (!moreDiv.contains(target) && target !== more) {
        moreDiv.classList.remove("moreDivActive");
    }
});




account.addEventListener("click", () => {


    const accountDetailsDiv = document.createElement("div")
    accountDetailsDiv.classList = "accountDetailsDiv"

    const accountDetails = document.createElement("div")
    accountDetails.classList = "accountDetails"
    const changeAccountName = document.createElement("sub")
    changeAccountName.innerHTML = "İstifadəçi adını dəyiş"
    const changeAccountPassword = document.createElement("sub")
    changeAccountPassword.innerHTML = "Parolu dəyiş"

    accountDetails.appendChild(changeAccountName)
    accountDetails.appendChild(changeAccountPassword)

    changeAccountPassword.addEventListener("click", () => {
        
    const changePasswordDiv = document.createElement("div")
    changePasswordDiv.classList = "changePasswordDiv"

        const passwordChangeDiv = document.createElement("div");
        passwordChangeDiv.classList.add("passwordChangeDiv");
    
        const passwordInput = document.createElement("input");
        passwordInput.type = "text";
        passwordInput.placeholder = "Hazırki şifrəni daxil et";
        passwordInput.classList.add("passwordInput");
    
        const newPasswordInput = document.createElement("input");
        newPasswordInput.type = "text";
        newPasswordInput.placeholder = "Yeni şifrəni daxil et";
        newPasswordInput.classList.add("newPasswordInput");
    
        const confirmPasswordInput = document.createElement("input");
        confirmPasswordInput.type = "text";
        confirmPasswordInput.placeholder = "Yeni şifrəni təsdiq et";
        confirmPasswordInput.classList.add("confirmPasswordInput");
    
        const submitButton = document.createElement("button");
        submitButton.textContent = "Təsdiqlə";
        submitButton.classList.add("submitButton");
        changePasswordDiv.appendChild(passwordChangeDiv)
        passwordChangeDiv.appendChild(passwordInput);
        passwordChangeDiv.appendChild(newPasswordInput);
        passwordChangeDiv.appendChild(confirmPasswordInput);
        passwordChangeDiv.appendChild(submitButton);
    

        const closePassword = document.createElement("button");
        closePassword.textContent = "X";
        changePasswordDiv.appendChild(closePassword)
        closePassword.classList.add("closePassword")

        document.body.appendChild(changePasswordDiv);
        closePassword.addEventListener("click",()=>{
        
                document.querySelector("body").removeChild(changePasswordDiv);
          
        })
    
      
        passwordChangeDiv.style.position = "fixed";
        passwordChangeDiv.style.top = "50%";
        passwordChangeDiv.style.left = "50%";
        passwordChangeDiv.style.transform = "translate(-50%, -50%)";

    
        submitButton.addEventListener("click", () => {
            const oldPassword = passwordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
        
            const minLength = 8;
            const hasLetter = /[a-zA-Z]/.test(newPassword);
            const hasNumber = /\d/.test(newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
        
            if (newPassword !== confirmPassword) {
                alert("Şifrələr uyğunlaşmır.");
                return;
            }
        
            if (newPassword.length < minLength || !hasLetter || !hasNumber || !hasSpecialChar) {
                alert("Şifrə azı 8 simvoldan ibarət olmalıdır, və azı bir hərf bir rəqəm və bir xüsusi simvolu olmalıdır.");
                return;
            }
        
            const username = localStorage.getItem("usernameMessage");
        
            const messageMeDb = firebase.database().ref("users");
            messageMeDb.orderByChild("name").equalTo(username).once("value", (snapshot) => {
                snapshot.forEach((userSnapshot) => {
                    const user = userSnapshot.val();
                    const userId = userSnapshot.key;
        
                    if (user.password === oldPassword) {
                        messageMeDb.child(userId).update({ password: newPassword })
                            .then(() => {
                                localStorage.setItem('passwordMessage', newPassword);
                                document.body.removeChild(passwordChangeDiv);
                                order()
                            })
                            .catch((error) => {
                                alert("Şifrə dəyişdirilərkən xəta baş verdi. ( şifrə dəyişmiş ola bilər daxil olarkən əgər köhnə şifrə ilə daxil ola bilməsəniz yeni şifrəni sınayın. ): " + error.message);
                            });
                    } else {
                        alert("Hazırki şifrə yanlışdır");
                    }
                });
            });
        });
        
    });








    changeAccountName.addEventListener("click", () => {
        const changeUsernameDiv = document.createElement("div");
        changeUsernameDiv.classList.add("changeUsernameDiv");

        const usernameChangeDiv = document.createElement("div");
        usernameChangeDiv.classList.add("usernameChangeDiv");
    
        const currentPasswordInput = document.createElement("input");
        currentPasswordInput.type = "text";
        currentPasswordInput.placeholder = "Hazırki şifrəni daxil et";
        currentPasswordInput.classList.add("currentPasswordInput");
    
        const newUsernameInput = document.createElement("input");
        newUsernameInput.type = "text";
        newUsernameInput.placeholder = "Yeni istifadəçi adını daxil et";
        newUsernameInput.classList.add("newUsernameInput");
    
        const submitButton = document.createElement("button");
        submitButton.textContent = "Təsdiqlə";
        submitButton.classList.add("submitButton");
    
        changeUsernameDiv.appendChild(usernameChangeDiv)
        usernameChangeDiv.appendChild(currentPasswordInput);
        usernameChangeDiv.appendChild(newUsernameInput);
        usernameChangeDiv.appendChild(submitButton);
    
        const closeUsername = document.createElement("button");
        closeUsername.textContent = "X";
        changeUsernameDiv.appendChild(closeUsername);
        closeUsername.classList.add("closeUsername");
    
        document.body.appendChild(changeUsernameDiv);
    
        closeUsername.addEventListener("click", () => {
            document.querySelector("body").removeChild(changeUsernameDiv);
            order()
        });
    
        usernameChangeDiv.style.position = "fixed";
        usernameChangeDiv.style.top = "50%";
        usernameChangeDiv.style.left = "50%";
        usernameChangeDiv.style.transform = "translate(-50%, -50%)";
    
    
        submitButton.addEventListener("click", () => {
            const currentPassword = currentPasswordInput.value;
            const newUsername = newUsernameInput.value;
        
            const username = localStorage.getItem("usernameMessage");
        
            const messageMeDb = firebase.database().ref("users");
            messageMeDb.orderByChild("name").equalTo(username).once("value", (snapshot) => {
                snapshot.forEach((userSnapshot) => {
                    const user = userSnapshot.val();
                    const userId = userSnapshot.key;
        
                    if (user.password === currentPassword) {
                      
                        const minUsernameLength = 3;
                        const maxUsernameLength = 20;
                        const hasSpacesInUsername = /\s/.test(newUsername);
                        const hasUppercaseInUsername = /[A-Z]/.test(newUsername);

                        if (
                            newUsername.toLowerCase() !== newUsername ||
                            newUsername.length < minUsernameLength ||
                            newUsername.length > maxUsernameLength ||
                            hasSpacesInUsername ||
                            hasUppercaseInUsername
                        ) {
                            alert(`İstifadəçi adı azı ${minUsernameLength} və ən çox ${maxUsernameLength} simvoldan ibarət olmalıdır. Boşluq ( " " ) və böyük hərf istifadə etmək olmaz.`);
                            signUp.disabled = false;
                            isSignUpDisabled = false;
                            return;
                        }
                        if (newUsername.length < minUsernameLength || newUsername.length > maxUsernameLength) {
                            alert(`İstifadəçi adı azı  ${minUsernameLength} və ən çox ${maxUsernameLength} simvoldan ibarət olmalıdır..`);
                            return;
                        }
        
                        if (hasSpacesInUsername) {
                            alert(`İstifadəçi adında boşluqdan (" ") istifadə olunub.`);
                            return;
                        }
        
                        messageMeDb.orderByChild("name").equalTo(newUsername).once("value", (snapshot) => {
                            if (!snapshot.exists()) {
                                
                                messageMeDb.child(userId).update({ name: newUsername })
                                    .then(() => {
                                        localStorage.setItem('usernameMessage', newUsername);
                                        localStorage.setItem('usernameMessage', newUsername);
                                        document.body.removeChild(changeUsernameDiv);
                                        order()
                                    })
                                    .catch((error) => {
                                        alert(`İstifadəçi adı dəyişdirilərkən xəta baş verdi.( istifadəçi adı dəyişmiş ola bilər. Daxil olarkən əgər köhnə istifadəçi adınız ilə daxil ola bilməsəniz yeni istifadəçi adını sınayın. ): ` + error.message);
                                    });
                            } else {
                                alert("Username is already taken.");
                            }
                        });
                    } else {
                        alert("Current password is incorrect.");
                    }
                });
            });
        });
        
    });
    






    accountDetailsDiv.appendChild(accountDetails)
    document.querySelector("body").appendChild(accountDetailsDiv)

    accountDetailsDiv.addEventListener("click", (event) => {
        if (event.target === accountDetailsDiv) {
            document.querySelector("body").removeChild(accountDetailsDiv);
        }
    });

})

