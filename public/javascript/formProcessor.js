let app = {};

app.bindForms = () => {
  if (document.querySelector("form")) {
    const allForms = document.querySelectorAll("form");
    // add submit event listener to all forms
    for (let i = 0; i < allForms.length; i++) {
      allForms[i].addEventListener("submit", (e) => {
        e.preventDefault();
        const formId = e.target.id;
        const path = e.target.action;
        const method = e.target.method.toUpperCase();
        // Hide previous error message
        document.querySelector(`#${formId} .formError`).style.display = "none";
        // Hide previous success message
        if (document.querySelector(`#${formId} .formSuccess`)) {
          document.querySelector(`#${formId} .formSuccess`).style.display =
            "none";
        }

        // Handle payload
        let payload = {};
        const elements = e.target.elements;
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].type !== "submit") {
            let name = elements[i].name;
            payload[name] = elements[i].value;
          }
        }
        // Send the request
        if (formId !== "register") {
          fetch(path, {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }).then((response) => {
            response
              .json()
              .then((data) => {
                app.formResponseProcessor(formId, payload, data);
              })
              .catch((error) => {
                console.log(error);
                app.formResponseProcessor(formId, payload, error);
              });
          });
        } else {
          const formData = new FormData(e.target);
          for (const key of formData.keys()) {
            console.log(key, formData.get(key));
          }

          let req = new Request(path, {
            body: formData,
            method: method,
          });
          fetch(req).then((response) => {
            response
              .json()
              .then((data) => {
                console.log(data);
                app.formResponseProcessor(formId, payload, data);
              })
              .catch((error) => {
                console.log(error);
                app.formResponseProcessor(formId, payload, error);
              });
          });
        }
      });
    }
  }
};

app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
  let functionToCall = false;

  const responseMessage = () => {};
  // register,
  if (formId == "register") {
    if (responsePayload.status !== 200) {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      console.log(responsePayload.values);
      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 4000);
    } else {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      setTimeout(() => {
        window.location("/views/email-check");
      }, 3500);
    }
  }
  //login,
  if (formId == "login") {
    if (responsePayload.status !== 200) {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.error;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    } else {
      const userID = responsePayload.user;
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      setTimeout(() => {
        location.assign("/routes/" + userID);
      }, 1500);
    }
  }

  if (formId == "subscription__form") {
    if (responsePayload.status !== 200) {
      console.log(responsePayload.status);
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    } else {
      console.log(responsePayload.status);
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("success");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    }
  }

  //do the contact me form
  //do not touch the delete adn edit forms because of use of method override to override the default behavior of forms

  if (formId == "blog-post__form") {
    if (responsePayload.status !== 200) {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    } else {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      setTimeout(() => {
        location.assign("/routes/" + responsePayload.user + "/blog");
      }, 1500);
    }
  }
  //fix this part
  if (formId == "admin-login__form") {
    if (responsePayload.status !== 200) {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    } else {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      setTimeout(() => {
        location.assign("/admin/home");
      }, 1500);
    }
  }

  if (formId == "preset__form") {
    if (responsePayload.status !== 200) {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("error");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;

      setTimeout(() => {
        document.querySelector(`#${formId} .form-group`).style.visibility =
          "hidden";
        document
          .querySelector(`#${formId} .form-group`)
          .classList.remove("error");
        document.querySelector(`#${formId} .form-group small`).innerHTML = "";
      }, 1500);
    } else {
      document.querySelector(`#${formId} .form-group`).style.visibility =
        "visible";
      document.querySelector(`#${formId} .form-group`).classList.add("success");
      document.querySelector(`#${formId} .form-group small`).innerHTML =
        responsePayload.message;
      setTimeout(() => {
        location.assign("/routes/" + responsePayload.user + "/blog");
      }, 1500);
    }
  }

  //subscription__form,
  //contact__form-id,
  //blog-edit__form,
  //blog-post__form,
  //delete__form,
  //admin-edit__form,
  //admin-login__form,
};

app.init = () => {
  app.bindForms();
};

window.onload = () => {
  app.init();
};
