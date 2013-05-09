$(document).ready(function () {
  $('.date').attr('value', new Date().toJSON().split('T')[0]);

  // Change , to . for numbers.
  $('[name="price"]').keypress(function () {
    $(this).attr('value', $(this).attr('value').replace(',', '.'));
  });

  // Custom validator for debtors checkbox.
  $.validator.addMethod('debtors', function (value, element) {
    // The signed in user is always the top entry.
    var signedInUser = $(element).attr('value');

    // Get all the values of the group (value from function only return the value of the first chekcbox).
    var valid = false;
    $('[name="debtors"]').each(function (index) {
      var checked = $(this).prop('checked');
      var user = $(this).attr('value');

      if (checked && user != signedInUser) {
        valid = true;
      }
    });

    return valid;
  });
});

// Validates the form 
function submitCreateForm() {
  var validator = $('#create-form').validate({
    rules: {
      ware: "required",
      price: {
        required: true, 
        number: true
      },
      debtors: "debtors"
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
      var labelElement;
      if ($(element).attr('name') == "debtors") {
        labelElement = $(element).parent().prev('label');
      } else {
        labelElement = $(element).prev('label');
      }
      error.insertAfter(labelElement);
    },
    messages: {
      ware: "You must enter a ware.",
      price: {
        required: "You must enter a price.",
        number: "Price must be a number."
      },
      debtors: "You must select at least one debtor other than yourself."
    }
  });
 
  if (validator.form()) {
    $('#create-form').submit();
  }
}

