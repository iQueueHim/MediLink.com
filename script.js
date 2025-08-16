document.addEventListener("DOMContentLoaded", () => {
  // ---------- Step 1: Create Account (Username + Password) ----------
  const setPasswordForm = document.getElementById("setPasswordForm");
  if (setPasswordForm && !document.body.classList.contains("security")) {
    setPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("Password").value.trim();
      const message = document.getElementById("message");

      if (!username || !password) {
        message.textContent = "Please fill in all fields.";
        message.style.color = "red";
        return;
      }

      // Temporarily save credentials
      localStorage.setItem("tempUsername", username);
      localStorage.setItem("tempPassword", password);

      // Move to step 2
      window.location.href = "bio-job.html";
    });
  }

  // ---------- Step 2: Bio + Job ----------
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    // Sort specialization dropdown
    const specialization = document.getElementById("specialization");
    if (specialization) {
      let options = Array.from(specialization.options).slice(1);
      options.sort((a, b) => a.text.localeCompare(b.text));
      specialization.innerHTML = "<option value=''></option>";
      options.forEach(opt => specialization.add(opt));
    }

    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullname = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const specializationVal = document.getElementById("specialization").value;
      const license = document.getElementById("license").value.trim();

      if (!fullname || !email || !phone || !specializationVal || !license) {
        alert("Please fill in all fields.");
        return;
      }

      // Retrieve step 1
      const username = localStorage.getItem("tempUsername");
      const password = localStorage.getItem("tempPassword");

      if (!username || !password) {
        alert("Something went wrong. Please restart registration.");
        window.location.href = "create-account.html";
        return;
      }

      // Save final account object
      const account = {
        username,
        password,
        fullname,
        email,
        phone,
        specialization: specializationVal,
        license
      };

      // Handle profile picture upload
      const file = document.getElementById("profilePic").files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          account.profilePic = reader.result;
          localStorage.setItem("userAccount", JSON.stringify(account));
          cleanupTemp();
          alert("Account created successfully! You can now log in.");
          window.location.href = "home.html";
        };
        reader.readAsDataURL(file);
      } else {
        localStorage.setItem("userAccount", JSON.stringify(account));
        cleanupTemp();
        alert("Account created successfully! You can now log in.");
        window.location.href = "login.html";
      }
    });
  }

  function cleanupTemp() {
    localStorage.removeItem("tempUsername");
    localStorage.removeItem("tempPassword");
  }

  // ---------- Login ----------
  const loginForm = document.getElementById("adminLoginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      const message = document.getElementById("message");

      const storedAccount = JSON.parse(localStorage.getItem("userAccount"));

      if (storedAccount &&
          storedAccount.username === username &&
          storedAccount.password === password) {
        localStorage.setItem("activeUser", username);
        window.location.href = "home.html";
      } else {
        message.textContent = "Invalid username or password!";
        message.style.color = "red";
      }
    });
  }

  // ---------- Change Password ----------
  const changePassForm = document.getElementById("setPasswordForm");
  if (changePassForm && document.body.classList.contains("security")) {
    changePassForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();
      const message = document.getElementById("message");

      const activeUser = localStorage.getItem("activeUser");
      let storedAccount = JSON.parse(localStorage.getItem("userAccount"));

      if (!activeUser || !storedAccount) {
        message.textContent = "No user is currently logged in.";
        message.style.color = "red";
        return;
      }

      if (newPassword !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        message.style.color = "red";
        return;
      }

      if (newPassword.length < 4) {
        message.textContent = "Password must be at least 4 characters.";
        message.style.color = "red";
        return;
      }

      storedAccount.password = newPassword;
      localStorage.setItem("userAccount", JSON.stringify(storedAccount));

      message.textContent = "Password updated successfully!";
      message.style.color = "green";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  // ---------- Log Out ----------
  const logoutBtn = document.querySelector(".log");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("activeUser");
      window.location.href = "index.html";
    });
  }

  // ---------- Sidebar Toggle ----------
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");
  if (toggleBtn && sidebar && content) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("collapsed");
    });
  }

  // ---------- Chat Feature ----------
  const chatButton = document.getElementById("chatButton");
  const chatBox = document.getElementById("chatBox");
  const closeChat = document.getElementById("closeChat");
  const sendChat = document.getElementById("sendChat");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (chatButton && chatBox && closeChat && sendChat && chatInput && chatMessages) {
    chatButton.addEventListener("click", () => {
      chatBox.style.display = "flex";
      chatButton.style.display = "none";
    });

    closeChat.addEventListener("click", () => {
      chatBox.style.display = "none";
      chatButton.style.display = "flex";
    });

    function sendMessage() {
      let message = chatInput.value.trim();
      if (message !== "") {
        let userMsg = document.createElement("p");
        userMsg.classList.add("user");
        userMsg.textContent = message;
        chatMessages.appendChild(userMsg);
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          let botMsg = document.createElement("p");
          botMsg.classList.add("bot");
          botMsg.textContent = "Thank you for your message, we’ll get back to you!";
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
      }
    }

    sendChat.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

// Save account info temporarily in localStorage after bio-job.html form
document.getElementById("registrationForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const specialization = document.getElementById("specialization").value;
  const license = document.getElementById("license").value;

  // Handle profile pic
  const fileInput = document.getElementById("profilePic");
  let profilePic = "";

  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem("profilePic", e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    // fallback image if none uploaded
    profilePic = "doctor.png";
    localStorage.setItem("profilePic", profilePic);
  }

  // Save user details
  localStorage.setItem("fullname", fullname);
  localStorage.setItem("email", email);
  localStorage.setItem("phone", phone);
  localStorage.setItem("specialization", specialization);
  localStorage.setItem("license", license);

  // Redirect to profile page
  window.location.href = "profile.html";
});

// Load data in profile.html
window.addEventListener("DOMContentLoaded", function () {
  const fullname = localStorage.getItem("fullname");
  const email = localStorage.getItem("email");
  const phone = localStorage.getItem("phone");
  const specialization = localStorage.getItem("specialization");
  const license = localStorage.getItem("license");
  const profilePic = localStorage.getItem("profilePic") || "doctor.png";

  const welkies = document.querySelector(".welkies");
  const profileImage = document.getElementById("profileImage");
  const profileDetails = document.getElementById("profileDetails");

  if (welkies && fullname) {
    welkies.textContent = `Welcome, Dr. ${fullname}!`;
  }

  if (profileImage) {
    profileImage.src = profilePic;
    profileImage.classList.add("profile-img"); // apply circular style
  }

  if (profileDetails) {
    profileDetails.innerHTML = `
      <strong>Email:</strong> ${email}<br><br>
      <strong>Phone:</strong> ${phone}<br><br>
      <strong>Specialization:</strong> ${specialization}<br><br>
      <strong>License:</strong> ${license}
    `;
  }
});



});
