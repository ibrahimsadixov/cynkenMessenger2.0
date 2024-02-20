const search = document.getElementById("search")
const clear = document.getElementById("clear")

clear.addEventListener("click", () => {
   
    search.value = ""; 
    userList.innerHTML = ""; 
    load()
    if (search.value!="") {
        clear.style.display="flex"
        console.log("oldu")
    } else if (search.value=="") {
            clear.style.display="none"
        }
   
});

search.addEventListener("input", () => {
    
   load()
   if (search.value!="") {
    clear.style.display="flex"
    console.log("oldu")
} else if (search.value=="") {
        clear.style.display="none"
    }
});

if (search.value!="") {
    clear.style.display="flex"
    console.log("oldu")
} else if (search.value=="") {
        clear.style.display="none"
    }


function load() {
    const searchTerm = search.value;
    const userList = document.getElementById("userList");
    const messageMeDb = firebase.database().ref("users");

  
    messageMeDb.orderByChild("name").startAt(searchTerm).endAt(searchTerm + "\uf8ff").on("value", (snapshot) => {
        userList.innerHTML = ""; 

        snapshot.forEach((user) => {
            const userIDs = user.val().id;
            const userNames = user.val().name
            const userphoto = user.val().photo;

            const listItem = document.createElement("li");
            listItem.classList.add("listItem");



            const usersImages = document.createElement("img");
            usersImages.classList.add("profileImage");
            if (userphoto == null) {
                usersImages.src = "./assets/images/logo/comandantelogo.png";
            } else {
                usersImages.src = userphoto;

            }
            listItem.appendChild(usersImages);

            usersImages.addEventListener("click", () => {

                const largenImageBg = document.createElement("div")
                const profileImageLarge = document.createElement("img")
                if (userphoto == null) {
                    profileImageLarge.src = "./assets/images/logo/comandantelogo.png";
                } else {
                    profileImageLarge.src = userphoto;

                }
                largenImageBg.classList.add("largen")
                largenImageBg.appendChild(profileImageLarge)
                document.querySelector("body").appendChild(largenImageBg)

                largenImageBg.addEventListener("click", (event) => {
                    if (event.target === largenImageBg) {
                        document.querySelector("body").removeChild(largenImageBg);
                    }

                })

            })

            const users = document.createElement("span");
            users.textContent = userNames;
            users.classList.add("username")

            const lastMessageSpan = document.createElement("span");
            lastMessageSpan.classList.add("lastMessage");

            const countSpan = document.createElement("span");
            countSpan.classList.add("countSpan");



            const lastMessageRefCurrentUserToOther = firebase.database().ref("conversations").child(`${senderID}_${userIDs}`).limitToLast(1);
            const lastMessageRefOtherUserToCurrent = firebase.database().ref("conversations").child(`${userIDs}_${senderID}`).limitToLast(1);


            const unseenRefCtoO = firebase.database().ref("conversations").child(`${senderID}_${userIDs}`).limitToLast(10);
            const unseenRefOtoC = firebase.database().ref("conversations").child(`${userIDs}_${senderID}`).limitToLast(10);
            let countCtoO = 0;
            let countOtoC = 0;

            const handleUnseenMessages = () => {
                const totalUnseen = countCtoO + countOtoC;
                totalUnseenMessages = totalUnseen;

                if (totalUnseenMessages > 0 && !isPageVisible && letNot) {

                    notificationSound.play();
                }


                if (countCtoO === 0) {
                    countCtoO = "";
                }
                if (countOtoC === 0) {
                    countOtoC = "";
                }

                countSpan.textContent = ` ${countCtoO} ${countOtoC}`;
                if (countSpan.textContent.trim() !== "") {
                    listItem.appendChild(countSpan);
                } else {
                    listItem.removeChild(countSpan);
                }


            };

            if (userIDs != senderID) {

            }
            unseenRefCtoO.on("child_added", (unseenMessageSnapshot) => {


                const unseenMessage = unseenMessageSnapshot.val();
                if (unseenMessage.sender !== senderID && unseenMessage.seen === false) {
                    countCtoO++;

                    handleUnseenMessages();
                }
            });

            unseenRefCtoO.on("child_changed", (unseenMessageSnapshot) => {
                const unseenMessage = unseenMessageSnapshot.val();
                if (unseenMessage.sender !== senderID && unseenMessage.seen === true) {
                    countCtoO--;
                    handleUnseenMessages();
                }
            });

            unseenRefOtoC.on("child_added", (unseenMessageSnapshot) => {

                const unseenMessage = unseenMessageSnapshot.val();
                if (unseenMessage.sender !== senderID && unseenMessage.seen === false) {

                    if (!isPageVisible && letNot) {

                        notificationSound.play()
                    }

                    countOtoC++;

                    handleUnseenMessages();
                }
            });

            unseenRefOtoC.on("child_changed", (unseenMessageSnapshot) => {
                const unseenMessage = unseenMessageSnapshot.val();
                if (unseenMessage.sender !== senderID && unseenMessage.seen === true) {

                    countOtoC--;
                    handleUnseenMessages();
                }
            });



            lastMessageRefCurrentUserToOther.on("child_added", (lastMessageSnapshot) => {
                const lastMessage = lastMessageSnapshot.val();
                const timestamp = lastMessage.timestamp;
                const formattedTime = formatTimestamp(timestamp);
                lastMessageSpan.textContent = `${lastMessage.sender === senderID ? "" : ""}${formattedTime}`;
                order();

            });

            lastMessageRefOtherUserToCurrent.on("child_added", (lastMessageSnapshot) => {
                const lastMessage = lastMessageSnapshot.val();
                const timestamp = lastMessage.timestamp;
                const formattedTime = formatTimestamp(timestamp);
                lastMessageSpan.textContent = formattedTime;
                order();

            });


            function formatTimestamp(timestamp) {
                const date = new Date(timestamp);
                const month = date.getMonth() + 1; // Months are zero-based
                const day = date.getDate();
                const year = date.getFullYear();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const second = date.getSeconds();
                const formattedTime = `${month}/${day}/${year} ${hour}:${minute}:${second}`;
                return formattedTime;
            }


            listItem.appendChild(users);

            listItem.appendChild(lastMessageSpan);




            listItem.addEventListener("click", (event) => {
                if (window.innerWidth <= 580 && !event.target.classList.contains("profileImage")) {

                    left.classList.add("closed")
                    left.classList.remove("open")
                    right.classList.add("open")
                    right.classList.remove("closed")


                }
                let recieverID = userIDs;
                if ((event.target === listItem || listItem.contains(event.target)) && !event.target.classList.contains("profileImage")) {

                    const otherUserImage = userphoto;
                    let otherUser = userNames;

                    displayUserMessages(recieverID, otherUserImage, otherUser);
                }
            });
            userList.appendChild(listItem); 
     
        });
    });
    order();
    
}