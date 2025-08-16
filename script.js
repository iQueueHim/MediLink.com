// Redirect after create-account
document.addEventListener("DOMContentLoaded", () => {
  const passwordForm = document.getElementById("setPasswordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("username", document.getElementById("username").value);
      localStorage.setItem("password", document.getElementById("password").value);
      window.location.href = "bio-job.html";
    });
  }

  // Sort specialization dropdown
  const specialization = document.getElementById("specialization");
  if (specialization) {
    let options = Array.from(specialization.options).slice(1);
    options.sort((a, b) => a.text.localeCompare(b.text));
    specialization.innerHTML = "<option value=''></option>";
    options.forEach(opt => specialization.add(opt));
  }

  // Save bio-job data + image
  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();

      localStorage.setItem("fullname", document.getElementById("fullname").value);
      localStorage.setItem("email", document.getElementById("email").value);
      localStorage.setItem("phone", document.getElementById("phone").value);
      localStorage.setItem("specialization", document.getElementById("specialization").value);
      localStorage.setItem("license", document.getElementById("license").value);

      const file = document.getElementById("profilePic").files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("profilePic", reader.result);
          window.location.href = "profile.html";
        };
        reader.readAsDataURL(file);
      } else {
        window.location.href = "profile.html";
      }
    });
  }

  // Load profile data
  if (window.location.pathname.includes("profile.html")) {
    document.getElementById("profileImage").src =
      localStorage.getItem("profilePic") || "doctor.png";

    document.getElementById("profileDetails").innerHTML = `
      <strong>Username:</strong> ${localStorage.getItem("username") || ""}<br><br>
      <strong>Full Name:</strong> ${localStorage.getItem("fullname") || ""}<br><br>
      <strong>Email:</strong> ${localStorage.getItem("email") || ""}<br><br>
      <strong>Phone:</strong> ${localStorage.getItem("phone") || ""}<br><br>
      <strong>Specialization:</strong> ${localStorage.getItem("specialization") || ""}<br><br>
      <strong>License No:</strong> ${localStorage.getItem("license") || ""}
    `;
  }
});


// --------- Account Creation ----------
const createAccountForm = document.getElementById("setPasswordForm");
if (createAccountForm && !document.body.classList.contains("security")) {
  createAccountForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("Password").value.trim();
    const message = document.getElementById("message");

    if (!username || !password) {
      message.textContent = "Please fill in all fields.";
      message.style.color = "red";
      return;
    }

    // Save credentials in localStorage
    localStorage.setItem(username, password);

    message.textContent = "Account created successfully!";
    message.style.color = "green";

    // Redirect to login after 2s
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  });
}

// --------- Login ----------
const loginForm = document.getElementById("adminLoginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("adminPassword").value.trim();
    const message = document.getElementById("message");

    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
      // Store active session
      localStorage.setItem("activeUser", username);
      window.location.href = "home.html";
    } else {
      message.textContent = "Invalid username or password!";
      message.style.color = "red";
    }
  });
}

// --------- Change Password ----------
const changePassForm = document.getElementById("setPasswordForm");
if (changePassForm && document.body.classList.contains("security")) {
  changePassForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("message");

    const activeUser = localStorage.getItem("activeUser");

    if (!activeUser) {
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

    // Update password
    localStorage.setItem(activeUser, newPassword);

    message.textContent = "Password updated successfully!";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  });
}

// --------- Log Out ----------
const logoutBtn = document.querySelector(".log");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("activeUser");
    window.location.href = "index.html";
  });
}

// --------- Sidebar Toggle ----------// --------- Collapsible Sidebar ----------
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");

if (toggleBtn && sidebar && content) {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("collapsed");
  });
}


function logout() {
  alert("Logging out...");
  // add your logout logic here
}
