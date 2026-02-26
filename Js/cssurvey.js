//--------------------------------------------------
// Author: Danielle Moore
// Date: 2/23/2026
// Class: SWE 645 Spring 2026
// Assignment: HW2
//
// Description: This JavaScript file contains the functions for
// validating the survey form, handling user greetings,
// calculating average and maximum values from user input,
// managing cookies, and looking up city and state based on zip code.
//--------------------------------------------------

//----------------------------------------
// Raffle Input helper functions for question 9
//----------------------------------------

//function to check if the input contains numbers only in specified range (1-100) (for question 9)
function checkNumberValues(userInput) {
  //check if the input contains numbers only in specified range (1-100)
  return userInput.every(function (stringValue) {
    let numberValue = Number(stringValue);
    return (
      Number.isInteger(numberValue) && numberValue >= 1 && numberValue <= 100
    );
  });
}

//function to validate the input values for the question 9
function valiadateInputValues(inputString) {
  //check if there is at least 1 comma
  if (inputString.indexOf(",") === -1) {
    return {
      isValid: false,
      message: "Please separate your numbers with commas in question 9.",
    };
  }

  // Make sure no other separators/delimiters are used and no invalid characters are present (only digits, commas, and spaces allowed)
  let invalidSeparators = /[^0-9,\s]/; // regex to match anything that's not a digit, comma, or space
  if (invalidSeparators.test(inputString)) {
    return {
      isValid: false,
      message:
        "Please use only numbers and commas as separators in question 9.",
    };
  }

  // Split the input string by commas and trim whitespace
  let userInputArray = inputString.split(",").map(function (item) {
    return item.trim();
  });

  //check that there are exactly 10 numbers
  if (userInputArray.length !== 10) {
    return {
      isValid: false,
      message: "Please enter exactly 10 numbers in question 9.",
    };
  }

  //check that all values are valid numbers in the specified range
  if (!checkNumberValues(userInputArray)) {
    return {
      isValid: false,
      message: "All values must be integers between 1 and 100 in question 9.",
    };
  }

  // If all checks pass, return valid
  return { isValid: true, message: userInputArray.map(Number) }; // Convert strings to numbers before returning
}

//-----------------------------------------
// Submit Button Helper Functions
//-----------------------------------------

//function to validate radio button questions
function validateRadioGroupQuestions(groupName, message, errorMessages) {
  let selected = document.querySelector(
    'input[name="' + groupName + '"]:checked',
  );

  if (!selected) {
    errorMessages.push(message);
  }
}

//main validation function
function validateSurveyForm() {
  let errorMessages = [];

  //Name validation
  let firstName = document.getElementById("inputFirstName");
  let lastName = document.getElementById("inputLastName");

  //Regex pattern to only allow letters
  let nameRegexPattern = /^[A-Za-z]+$/;

  if (!nameRegexPattern.test(firstName.value)) {
    errorMessages.push("First name should contain only letters.");
    firstName.value = "";
  }

  if (!nameRegexPattern.test(lastName.value)) {
    errorMessages.push("Last name should contain only letters.");
    lastName.value = "";
  }

  //Address validation
  let streetAddress = document.getElementById("inputStreet");

  let addressRegexPattern = /^[A-Za-z0-9\s]+$/;

  if (!addressRegexPattern.test(streetAddress.value)) {
    errorMessages.push(
      "Address should contain only letters, numbers, and spaces.",
    );
    streetAddress.value = "";
  }

  //Email validation
  let email = document.getElementById("inputEmail");

  //Clear the email field if it's invalid
  if (!email.checkValidity()) {
    errorMessages.push("Email address is invalid.");
    email.value = "";
  }

  //Radio validations
  validateRadioGroupQuestions(
    "satisfaction",
    "Please answer Question 1.",
    errorMessages,
  );

  //Checkbox validation
  let checkboxes = document.querySelectorAll("input[name='interest']:checked");

  if (checkboxes.length < 1) {
    errorMessages.push("Please select at least one category in Question 2.");

    // Uncheck all checkboxes if validation fails
    document.querySelectorAll('input[name="interest"]').forEach(function (box) {
      box.checked = false;
    });
  }

  validateRadioGroupQuestions(
    "interestSource",
    "Please answer Question 3.",
    errorMessages,
  );

  validateRadioGroupQuestions(
    "informative",
    "Please answer Question 4.",
    errorMessages,
  );

  validateRadioGroupQuestions(
    "tourExperience",
    "Please answer Question 5.",
    errorMessages,
  );

  validateRadioGroupQuestions(
    "interestIncrease",
    "Please answer Question 6.",
    errorMessages,
  );

  //Displaying error messages
  if (errorMessages.length > 0) {
    alert(errorMessages.join("\n"));
    return false; // Prevent form submission
  }

  alert(
    "Thank you for completing the survey! Your responses have been submitted successfully.",
  );
  return true; // Allow form submission
}

//Function to capture student data on submit
function captureContactInformationJSON() {
  let studentData = {
    firstName: document.getElementById("inputFirstName").value,

    lastName: document.getElementById("inputLastName").value,

    address: document.getElementById("inputStreet").value,

    phone: document.getElementById("inputPhoneNumber").value,

    email: document.getElementById("inputEmail").value,
  };

  let jsonString = JSON.stringify(studentData, null, 2);

  console.log(jsonString);
}

//--------------------------------
// Zipcode lookup function
//---------------------------------
function lookupZipcode() {
  let zip = document.getElementById("inputZip").value.trim();

  fetch("ZIPCodes.json")
    .then((response) => response.json())

    .then((data) => {
      let result = data[zip];

      if (result) {
        document.getElementById("displayCity").textContent = result.city;

        document.getElementById("displayState").textContent = result.state;

        document.getElementById("zipError").textContent = "";
      } else {
        document.getElementById("displayCity").textContent =
          "(Auto-filled from zipcode)";

        document.getElementById("displayState").textContent =
          "(Auto-filled from zipcode)";

        document.getElementById("zipError").textContent = "Invalid Zip Code";
      }
    })

    .catch((error) => {
      console.log("Error loading ZIP file:", error);
    });
}

//-------------------
// Helper function for reseting autopopulated divs
//-------------------
function resetAutoFields() {
  document.getElementById("displayCity").textContent =
    "(Auto-filled from zipcode)";
  document.getElementById("displayState").textContent =
    "(Auto-filled from zipcode)";
  document.getElementById("zipError").textContent = "";
}

//-------------------
//Event listeners for submit and reset buttons
//-------------------

//Submit button event listener
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("surveyForm");

  form.addEventListener("submit", function (event) {
    // Stop default submission
    event.preventDefault();

    const isValid = validateSurveyForm();

    console.log("Validation result:", isValid); // DEBUG

    if (!isValid) {
      return;
    }
    captureContactInformationJSON();
    form.reset();
    resetAutoFields();
  });
});

//Reset button event listener
document.addEventListener("DOMContentLoaded", function () {
  const resetFormButton = document.getElementById("reset-button");
  const form = document.getElementById("surveyForm");

  resetFormButton.addEventListener("click", function (event) {
    //ensures there is no accidental submission of the form when user clicks reset button
    event.preventDefault();

    if (
      confirm("Are you sure you want to rest the form? All data will be lost.")
    ) {
      //resetting the form
      form.reset();
      resetAutoFields();
    }
  });
});
