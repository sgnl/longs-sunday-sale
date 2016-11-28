window.onload = function() {
  const newsletterForm = $('#newsletter-signup');

  newsletterForm.submit(event => {
    event.preventDefault();

    var settings = {
      'async': true,
      // 'crossDomain': true,
      'url': '/newsletter/sub',
      'method': 'POST',
      'headers': {
        'content-type': 'application/json',
        'cache-control': 'no-cache',
      },
      'data': JSON.stringify({email: newsletterForm.find('#email').val()})
    }

    $.ajax(settings)
      .done(updateViewWithSuccess(newsletterForm))
      .fail(updateViewWithError(newsletterForm));
  });
};

function updateViewWithSuccess(view) {
  const parentEl = view.parent();


  return function(response) {
    const newHeader = $('<h5>', {class: 'center-align', text: response});

    parentEl.empty();
    parentEl.append(newHeader);
  };
}

function updateViewWithError(view) {
  return (jqXHR, textStatus) => {

  };
}
