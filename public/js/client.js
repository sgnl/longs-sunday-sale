window.onload = function() {
  const newsletterForm = $('#newsletter-signup');

  newsletterForm.submit(event => {
    event.preventDefault();

    const emailEl = newsletterForm.find('#email');

    const settings = {
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
      .done(updateView(newsletterForm))
      .fail(updateView(newsletterForm));
  });
};

function updateView(view) {
  return function(response) {
    view.find('#email')
      .val(response)
      .attr('readonly', true);

    view.find('.btn:last-child').val('success').addClass('disabled');
  };
}
