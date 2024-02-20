const firebaseConfig = {
    apiKey: "AIzaSyCQuABLnB7AZXyHCnkLBKOWI_InltaR_fw",
    authDomain: "message-e092c.firebaseapp.com",
    databaseURL: "https://message-e092c-default-rtdb.firebaseio.com",
    projectId: "message-e092c",
    storageBucket: "message-e092c.appspot.com",
    messagingSenderId: "818764436281",
    appId: "1:818764436281:web:2bb174a3923a79c952cee8",
    measurementId: "G-SHH7HYBN3T"
};


firebase.initializeApp(firebaseConfig);
let letNot = localStorage.getItem("letNot")
const currentUser = localStorage.getItem("usernameMessage")
const senderID = localStorage.getItem('useridMessage');
const storedPassword = localStorage.getItem('passwordMessage');
const notificationSound = document.getElementById("notification")
const notSwitch = document.getElementById("notificationSwitch")
const mobileClose = document.getElementById("mobileClose")

const imageChange = document.getElementById("imageChange")

const uploadBtn = document.getElementById("uploadBtn")

const view = document.getElementById("view")

const account = document.getElementById("account")

const not = document.getElementById("not")
let totalUnseenMessages = 0;


window.onload = () => {
    if (window.innerWidth <= 580) {
        right.classList.add("closed");
        left.classList.add("open");
        right.classList.remove("open");
        left.classList.remove("closed");
    }
    if (letNot === false) {

        not.classList.remove("fa-bell");
        not.classList.add("fa-bell-slash");
    } else if (letNot === true) {
        not.classList.add("fa-bell");
        not.classList.remove("fa-bell-slash");
    }

};






if (letNot === null || letNot === undefined) {
    letNot = true;
} else {
    letNot = letNot === 'true';
}

function bellChange() {
    if (!letNot) {
        letNot = true;
        not.classList.add("fa-bell");
        not.classList.remove("fa-bell-slash");
    } else {
        letNot = false;
        not.classList.remove("fa-bell");
        not.classList.add("fa-bell-slash");
    }

}
function switcher() {
    bellChange()
    localStorage.setItem('letNot', letNot);
}

notSwitch.addEventListener("click", () => {
    switcher();
});



var isPageVisible = false;

document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;

});



const messageMeDb = firebase.database().ref("users")

messageMeDb.on("value", (snapshot) => {
    const userList = document.getElementById("userList");

    userList.innerHTML = "";

    if (snapshot.exists()) {

        snapshot.forEach((user) => {

            const userIDs = user.val().id;

            const userNames = user.val().name;
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


                if (countCtoO <= 0) {
                    countCtoO = "";
                }
                if (countOtoC <= 0) {
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
    }


});


function order() {
    const userList = document.getElementById("userList");
    const listItems = Array.from(userList.querySelectorAll(".listItem"));

    const sortedListItems = listItems.sort((a, b) => {
        const timestampA = extractTimestamp(a.querySelector(".lastMessage").textContent);
        const timestampB = extractTimestamp(b.querySelector(".lastMessage").textContent);
        return timestampB - timestampA;
    });

    sortedListItems.forEach(item => userList.appendChild(item));
}


function extractTimestamp(formattedTime) {
    const date = new Date(formattedTime);

    if (!isNaN(date.getTime())) {
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return Number(year + month + day + hours + minutes + seconds);
    }

    return 0;
}


order();




messageMeDb.orderByChild("id").equalTo(senderID).once("value", (snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((user) => {
            const storedDbPassword = user.val().password;
            if (storedPassword === storedDbPassword) {
                const displayUsernameElement = document.getElementById("displayUsername");
                displayUsernameElement.textContent = `${currentUser}`;

                const displayProfileImageElement = document.getElementById("displayProfileImage");
                const storedProfileImageUrl = user.val().photo;

                if (storedProfileImageUrl) {
                    displayProfileImageElement.src = storedProfileImageUrl;
                    viewLarge(storedProfileImageUrl)
                } else {
                    const profileImageLocal = "./assets/images/logo/comandantelogo.png"
                    displayProfileImageElement.src = profileImageLocal;
                    viewLarge(profileImageLocal)
                }
            } else {
                alert('Incorrect password!');
                document.getElementById("displayUsername").textContent = "";
            }
        });
    } else {

        //     document.getElementById("displayUsername").textContent = "";
        //     window.location.href = "index.htm";
    }
});

function handleMessageInput(event, recieverID) {
    if (event.key === 'Enter' && !event.shiftKey) {
        sendMessage(recieverID);
        event.preventDefault();
    }
}

const userMessagesContainer = document.getElementById("userMessagesContainer");
const left = document.getElementById("left");
const right = document.getElementById("right");
// mobile


mobileClose.addEventListener("click", () => {
clickedUsername=""

    left.classList.add("open")
    left.classList.remove("closed")
    right.classList.add("closed")
    right.classList.remove("open")
    userMessagesContainer.innerHTML = ""
    const messenger = document.querySelector(".messenger")

    messenger.style.width = "90%"
    right.style.paddingLeft = "15px"
    right.style.paddingRight = "15px"
})

const winHeight = window.innerHeight
const winWidth = window.innerWidth
const isChromeOrSafari = /Chrome|Safari/.test(navigator.userAgent);



// mobile
function displayUserMessages(recieverID, otherUserImage, otherUser) {
    clickedUsername = recieverID

    const userMessagesContainer = document.getElementById("userMessagesContainer");
    userMessagesContainer.innerHTML = "";

    if (otherUserImage == null) {
        otherUserImage = "./assets/images/logo/comandantelogo.png";
    }




    const messenger = document.querySelector(".messenger")
    const right = document.querySelector(".right")
    if (window.innerWidth <= 580) {
        messenger.style.width = "100%"
        right.style.paddingLeft = "25px"
        right.style.paddingRight = "25px"

    }


    const divOtherUser = document.createElement('div');
    divOtherUser.classList.add('otherUser');

    const imgProfileImage = document.createElement('img');
    imgProfileImage.classList.add('profileImage');
    imgProfileImage.src = otherUserImage;

    const h3OtherUser = document.createElement('h3');
    h3OtherUser.textContent = otherUser;

    const formMessageForm = document.createElement('form');
    formMessageForm.id = 'messageForm';

    const ulMessageList = document.createElement('ul');
    ulMessageList.style.height = winWidth > 580 ? winHeight - 240 + 'px' : winHeight - 260 + 'px';
    ulMessageList.id = 'messageList';

    const divMyMessage = document.createElement('div');
    divMyMessage.classList.add('myMessage');



    const label = document.createElement('label');
    label.setAttribute('for', 'fileInput');
    label.className = 'fileLabel';
    label.style.display = 'inline-block';
    label.style.width = '30px';
    label.style.height = '30px';
    label.style.lineHeight = '30px';
    label.style.textAlign = 'center';

    label.style.cursor = 'pointer';


    const fileInputMessage = document.createElement('input');
    fileInputMessage.type = 'file';
    fileInputMessage.id = 'fileInput';
    fileInputMessage.className = 'fileInput';
    fileInputMessage.style.display = 'none';
    fileInputMessage.accept = 'image/*,video/*';



    const filePlus = document.createElement("span")
    filePlus.innerHTML = "+"
    divMyMessage.appendChild(label);
    label.appendChild(filePlus);

    divMyMessage.appendChild(fileInputMessage);

    fileInputMessage.addEventListener('change', (e) => {

        const fileSendingDiv = document.createElement("div")
        fileSendingDiv.classList.add("sending")

        const file = e.target.files[0];
        const fileDisplay = file.type.startsWith('image/') ? document.createElement("img") : document.createElement("video");
        fileDisplay.src = URL.createObjectURL(file);
        fileDisplay.setAttribute("controls", "controls");


        const sendBtn = document.createElement("button")
        sendBtn.innerHTML = "Göndər"

        fileSendingDiv.appendChild(sendBtn)
        fileSendingDiv.appendChild(fileDisplay)
        document.querySelector("body").appendChild(fileSendingDiv)

        fileSendingDiv.addEventListener("click", (event) => {
            if (event.target === fileSendingDiv) {
                document.querySelector("body").removeChild(fileSendingDiv);
            }
        })
        sendBtn.addEventListener("click", () => {
            sendFileToConversation(senderID, clickedUsername, file);

            document.querySelector("body").removeChild(fileSendingDiv);
        })

    });





    const messageTextArea = document.createElement('textarea');
    messageTextArea.placeholder = 'Mesajınızı yazın...';
    messageTextArea.id = 'messageInput';
    messageTextArea.style.resize = 'none';
    messageTextArea.setAttribute('maxlength', '800');

    const symbCount = document.createElement("sub")
    symbCount.classList = "symbCount"
    divMyMessage.appendChild(symbCount)

    function updateCharacterCount() {
        const maxLength = parseInt(messageTextArea.getAttribute('maxlength'));
        const currentLength = messageTextArea.value.length;
        const charactersLeft = maxLength - currentLength;
        if (charactersLeft >= 0) {

            symbCount.innerHTML = charactersLeft

        }
    }

    messageTextArea.addEventListener('input', updateCharacterCount);

    updateCharacterCount();



    const buttonSendBtn = document.createElement('button');
    buttonSendBtn.classList.add('sendBtn');
    buttonSendBtn.textContent = 'GÖNDƏR';
    buttonSendBtn.onclick = function (event) {
        sendMessage(recieverID, event);
    };

    // Append the elements
    divOtherUser.appendChild(imgProfileImage);
    divOtherUser.appendChild(h3OtherUser);

    divMyMessage.appendChild(messageTextArea);
    divMyMessage.appendChild(buttonSendBtn);

    formMessageForm.appendChild(ulMessageList);
    formMessageForm.appendChild(divMyMessage);

    userMessagesContainer.innerHTML = '';
    userMessagesContainer.appendChild(divOtherUser);
    userMessagesContainer.appendChild(formMessageForm);



    imgProfileImage.addEventListener("click", () => {
        const largenImageBg = document.createElement("div")
        const profileImageLarge = document.createElement("img")
        profileImageLarge.src = otherUserImage;
        largenImageBg.classList.add("largen")
        largenImageBg.appendChild(profileImageLarge)
        document.querySelector("body").appendChild(largenImageBg)

        largenImageBg.addEventListener("click", (event) => {
            if (event.target === largenImageBg) {
                document.querySelector("body").removeChild(largenImageBg);
            }

        })
    })


    const messageList = document.getElementById("messageList");




    let combinedRefs;

    if (recieverID !== senderID) {
        const conversationRef1 = firebase.database().ref("conversations").child(`${senderID}_${recieverID}`);
        const conversationRef2 = firebase.database().ref("conversations").child(`${recieverID}_${senderID}`);
        combinedRefs = [conversationRef1, conversationRef2];
    } else if (recieverID === senderID) {
        const conversationRef2 = firebase.database().ref("conversations").child(`${recieverID}_${senderID}`);
        combinedRefs = [conversationRef2];

    }

    combinedRefs.forEach((conversationRef) => {

        conversationRef.orderByChild('timestamp').on("child_added", (snapshot) => {
            const message = snapshot.val();
            const listItem = document.createElement("li");
            const messageTime = new Date(message.timestamp).toLocaleTimeString();


            if (message.sender === senderID) {
                const me = document.createElement("span");
                const time = document.createElement("sub");
                time.classList.add("time");
                time.textContent = `${messageTime}`;
                time.style.justifyContent = "flex-end";
                time.style.right = "20px";
                

                listItem.addEventListener("dblclick", () => {
             if (  !listItem.classList.contains("removedMessage")) {
                
             
                    const removeDiv = document.createElement("div")
                    removeDiv.classList.add("largen")
                    const removeElement = document.createElement("i")
                    removeElement.classList="fa-solid fa-trash remove"
                    removeDiv.appendChild(removeElement)
                    document.querySelector("body").appendChild(removeDiv)
                    

                     
                    removeElement.addEventListener("click", () => {
                        snapshot.ref.child('remove').set(true);
                        listItem.innerHTML = "mesaj silindi."
                         document.querySelector("body").removeChild(removeDiv);
                         listItem.classList.add("removedMessage")
                })
          
                
                
                removeDiv.addEventListener("click", (event) => {
                    if (event.target === removeDiv) {
                        document.querySelector("body").removeChild(removeDiv);
                    }

                })
            }
                });

                if (message.remove === true) {
                    listItem.innerHTML = "mesaj silindi."
                    listItem.classList.add("removedMessage")
                    me.style.display = "none"

                }



                else if (message.file && message.remove != true) {


                    if (message.file && message.remove != true) {

                        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].some(ext => message.file.toLowerCase().includes(ext));
                        const isVideo = ['.mp4', '.webm', '.ogg'].some(ext => message.file.toLowerCase().includes(ext));

                        if (isImage) {
                            const image = document.createElement("img");
                      

                                image.src = message.file;
                            
                            listItem.appendChild(image);

                            image.addEventListener("click", () => {



                                const largenImageBg = document.createElement("div")
                                const profileImageLarge = document.createElement("img")
                                profileImageLarge.src = message.file;
                                largenImageBg.classList.add("enlargable")

                                largenImageBg.appendChild(profileImageLarge)
                                profileImageLarge.addEventListener("dblclick",()=>{
                                    if (  !listItem.classList.contains("removedMessage")) {
                
             
                                        const removeDiv = document.createElement("div")
                                        removeDiv.classList.add("largen")
                                        const removeElement = document.createElement("i")
                                        removeElement.classList="fa-solid fa-trash remove"
                                        removeDiv.appendChild(removeElement)
                                        document.querySelector("body").appendChild(removeDiv)
                                        
                    
                                         
                                        removeElement.addEventListener("click", () => {
                                            snapshot.ref.child('remove').set(true);
                                            listItem.innerHTML = "mesaj silindi."
                                             document.querySelector("body").removeChild(removeDiv);
                                             listItem.classList.add("removedMessage")
                                             document.querySelector("body").removeChild (largenImageBg)

                    
                                    })
                               
                                    removeDiv.addEventListener("click", (event) => {
                                        if (event.target === removeDiv) {
                                            document.querySelector("body").removeChild(removeDiv);
                                        }
                    
                                    })
                                }
                                })
                                document.querySelector("body").appendChild(largenImageBg)

                                largenImageBg.addEventListener("click", (event) => {
                                    if (event.target === largenImageBg) {
                                        document.querySelector("body").removeChild(largenImageBg);
                                    }

                                })
                            })
                            image.classList.add("fileMessage");
                        } else if (isVideo) {
                            const video = document.createElement("video");


                        
                                video.src = message.file;
                       
                            video.setAttribute("controls", "controls");
                            listItem.appendChild(video);

                            video.classList.add("fileMessage");
                        } else {
                            const doesNotSup = document.createElement("div");
                            doesNotSup.innerHTML = "Fayl dəstəklənmir.";

                            listItem.appendChild(doesNotSup);
                            doesNotSup.classList.add("fileMessage");
                        }

                        listItem.classList.add("filedList");
                        me.classList.add("filed");
                        me.textContent = ``;
                    } else if (message.text) {
                        if (message.remove != true) {

                            me.textContent = `${message.text}`;
                        } else if (message.remove === true) {
                            me.textContent = ``;
                            me.style.display = "none"
                        }

                    }

                    listItem.classList.add("filedList");
                    me.classList.add("filed");
                    me.textContent = ``;
                } else if (message.text) {
                    if (message.remove != true) {

                        me.textContent = `${message.text}`;
                    } else if (message.remove === true) {
                        me.textContent = ``;
                        me.style.display = "none"
                    }
                }

                me.classList.add("me");
                me.appendChild(time);
                listItem.style.justifyContent = "flex-end";


                const seen = document.createElement("div");
                seen.classList.add("seen");
                if (message.remove != true) {
                    listItem.appendChild(seen);

                }


                snapshot.ref.child('seen').on('value', (seenSnapshot) => {


                    seen.classList.add(seenSnapshot.val() ? "seen-active" : "");
                });

                listItem.appendChild(me);

            }

            else if (message.sender === recieverID) {
                const other = document.createElement("span");
                const time = document.createElement("sub");
                time.classList.add("time");
                time.textContent = `${messageTime}`;
                time.style.justifyContent = "flex-start";
                time.style.left = "0px";



                if (message.remove === true) {
                    listItem.classList.add("removedMessage")
                    listItem.innerHTML = "mesaj silindi."
                    listItem.classList.add("removedMessage")
                    listItem.style.justifyContent = "flex-start"
                    other.style.display = "none"

                }



                if (message.file && message.remove != true) {


                    if (message.file) {

                        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].some(ext => message.file.toLowerCase().includes(ext));
                        const isVideo = ['.mp4', '.webm', '.ogg'].some(ext => message.file.toLowerCase().includes(ext));

                        if (isImage) {
                            const image = document.createElement("img");



                            image.src = message.file;

                            listItem.appendChild(image);

                            image.classList.add("fileMessage");
                            image.addEventListener("click", () => {
                                const largenImageBg = document.createElement("div")
                                const profileImageLarge = document.createElement("img")
                                profileImageLarge.src = message.file;
                                largenImageBg.classList.add("enlargable")

                                largenImageBg.appendChild(profileImageLarge)
                                document.querySelector("body").appendChild(largenImageBg)

                                largenImageBg.addEventListener("click", (event) => {
                                    if (event.target === largenImageBg) {
                                        document.querySelector("body").removeChild(largenImageBg);
                                    }

                                })
                            })
                        } else if (isVideo) {
                            const video = document.createElement("video");
                            video.src = message.file;

                            video.setAttribute("controls", "controls");
                            listItem.appendChild(video);


                            video.classList.add("fileMessage")



                        } else {
                            const doesNotSup = document.createElement("div");
                            doesNotSup.innerHTML = "Fayl dətəklənmir.";

                            listItem.appendChild(doesNotSup);
                            doesNotSup.classList.add("fileMessage");
                        }


                        other.textContent = ``;
                    } else if (message.text) {
                        if (message.remove != true) {

                            other.textContent = `${message.text}`;
                        } else if (message.remove === true) {
                            other.textContent = ``;
                            other.style.display = "none"
                        }
                    }


                    other.classList.add("filed");
                    other.textContent = ``;
                } else if (message.text) {
                    if (message.remove != true) {

                        other.textContent = `${message.text}`;
                    } else if (message.remove === true) {
                        other.textContent = ``;
                        other.style.display = "none"
                    }
                }




                other.classList.add("other");
                other.appendChild(time);
                listItem.style.justifyContent = "flex-start";
                listItem.appendChild(other);

                snapshot.ref.child('remove').on('value', (removeSnapshot) => {

if (removeSnapshot.val()===true) {
    
    listItem.innerHTML="mesaj silindi."
}
                });


                if (message.sender === clickedUsername && !message.seen ) {
                    snapshot.ref.update({ seen: true });

                }


                window.addEventListener("focus", () => {
                    if (message.sender === clickedUsername && !message.seen ) {

                        snapshot.ref.update({ seen: true });

                    }

                });

            }
            messageList.appendChild(listItem);

            requestAnimationFrame(() => {
                messageList.scrollTop = messageList.scrollHeight;
            });

        });



    });





    const messageInput = document.getElementById("messageInput");
    messageInput.addEventListener("keydown", (event) => {
        handleMessageInput(event, recieverID);
    });

}



function sendMessage(recieverID) {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        sendMessageToConversation(senderID, recieverID, messageText);
        messageInput.value = "";
        messageInput.dispatchEvent(new Event('input'));
    }
    event.preventDefault();
}
function sendMessageToConversation(sender, receiver, message) {
    const conversationKey = [sender, receiver].sort().join('_');
    const conversationRef = firebase.database().ref("conversations").child(conversationKey);

    let messageData = {};

    if (typeof message === 'string') {
        messageData = {
            sender: sender,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            seen: false,
        };
    } else if (message.downloadURL) {
        messageData = {
            sender: sender,
            file: message.downloadURL,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            seen: false,
        };
    }

    conversationRef.push(messageData);
}

function sendFileToConversation(sender, receiver, file) {
    const storageRef = firebase.storage().ref(`files/${sender}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
        },
        (error) => {
            console.error('Error uploading file:', error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                sendMessageToConversation(sender, receiver, { downloadURL: downloadURL });
            });
        }
    );
}




function viewLarge(user) {
    view.addEventListener("click", () => {
        const largenImageBg = document.createElement("div")
        const profileImageLarge = document.createElement("img")
        profileImageLarge.src = user;
        largenImageBg.classList.add("largen")
        largenImageBg.appendChild(profileImageLarge)
        document.querySelector("body").appendChild(largenImageBg)

        largenImageBg.addEventListener("click", (event) => {
            if (event.target === largenImageBg) {
                document.querySelector("body").removeChild(largenImageBg);
            }

        })
    })



}



uploadBtn.addEventListener('change', function (e) {


    const fileInput = e.target;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        const storageRef = firebase.storage().ref(`profileImages/${senderID}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {

            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {


                    messageMeDb.orderByChild('id').equalTo(senderID).once('child_added', (userSnapshot) => {
                        const userIDs = userSnapshot.key;
                        messageMeDb.child(userIDs).update({ photo: downloadURL });

                        document.getElementById('displayProfileImage').src = downloadURL;
                    });

                });
            }
        );
    }
});
const changeImage = document.getElementById("imageChange")
document.getElementById('displayProfileImage').addEventListener("click", () => {
    changeImage.classList.toggle("openImageChange")
})

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("openImageChange") && !event.target.classList.contains("profileImage")) {
        changeImage.classList.remove("openImageChange")
    }

})




