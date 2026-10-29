console.log("loading script file?");

document
  .querySelector("#btnCreateProfile")
  .addEventListener("click", createUserProfile);

async function createUserProfile(e) {
  e.preventDefault();
  // document.querySelector('#profileForm');

  //todo: defensive programming...check if nothing is there...
  //if(!nameInput)...
  const nameInput = document.querySelector("#nameInput").value;
  const favoriteInput = document.querySelector("#favoriteInput").value;
  const commentInput = document.querySelector("#commentInput").value;

  // 1. Empty-state handling
  if (nameInput.trim() === "" || commentInput.trim() === "" || favoriteInput === "Select favorite!") {
    alert("Please enter your name, comment, and select a favorite item.");
    return; // exit the function if any value is empty
  }

  // 2. Loading state
  const btn = document.querySelector("#btnCreateProfile");
  const originalBtnText = btn.textContent;
  btn.textContent = "Loading...";
  btn.disabled = true;

  // 3. Useful error handling
  try {
    const apiResponse = await fetch("https://dog.ceo/api/breeds/image/random");
    
    // throw an error if the API response is not ok (e.g., server down)
    if (!apiResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const dogData = await apiResponse.json();
    const dogPicValue = dogData.message;
    console.log("dogPicValue ", dogPicValue);

    const userData = {
      name: nameInput,
      favorite: favoriteInput,
      comment: commentInput,
      dogpic: dogPicValue,
    };

    console.log("userData object ", userData);

    const jsonString = JSON.stringify(userData);
    sessionStorage.setItem("sessionProfile", jsonString);

    renderProfile(userData);

  } catch (error) {
    // if the API call fails, this block will execute
    console.error("Failed to fetch API:", error);
    alert("Sorry, we couldn't load the dog image at this time. Please try again.");
  } finally {
    // reset the button state regardless of success or failure
    btn.textContent = originalBtnText;
    btn.disabled = false;
  }
}

async function loadOptions() {
  const response = await fetch("assets/data/data.json");

  if (!response.ok) {
    throw new Error("Could not load local JSON");
  }

  const data = await response.json();

  console.log("json data: ", data);

  const favorite = document.querySelector("#favoriteInput");
  let newOption;

  data.forEach((choice) => {
    newOption = new Option(choice.name, choice.id);
    favorite.appendChild(newOption);
  });
}
loadOptions();

function checkSession() {
  const savedData = sessionStorage.getItem("sessionProfile");

  if (savedData) {
    const profileData = JSON.parse(savedData);

    renderProfile(profileData);
  }
}

checkSession();

document
  .querySelector("#btnClearSession")
  .addEventListener("click", function () {
    sessionStorage.clear();
    location.reload();
  });

function renderProfile(data) {
  document.querySelector("#profileForm").style.display = "none";
  document.querySelector("#profileDisplay").style.display = "block";
  document.querySelector("#displayName").textContent = data.name;
  document.querySelector("#displayFavorite").textContent = data.favorite;
  document.querySelector("#displayComment").textContent = data.comment;
  document.querySelector("#displayDogPic").src = data.dogpic;
}