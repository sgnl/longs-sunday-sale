window.onload = function() {
  const newsletterForm = document.querySelector('#newsletter-signup');

  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();

    var data = JSON.stringify({email: newsletterForm.querySelector('#email').value});

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', updateViewWithSuccess);
    xhr.addEventListener('error', updateViewWithError);

    xhr.open("POST", "/newsletter/sub");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
  });
};

function updateViewWithSuccess(event) {
  console.log(this.responseText);
}

function updateViewWithError(event) {
  console.log(this.responseText);
}
