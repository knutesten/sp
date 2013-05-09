$(document).ready(function () {
 // Change , to . for numbers.
  $('[name="amount"]').keypress(function () {
    $(this).attr('value', $(this).attr('value').replace(',', '.'));
  });
});

function submitClearForm() {
  $.validator.addMethod('maxClear', function (value, element) {
    // Want different mesage for this type of input.
    var max = parseFloat($('select').find(":selected").attr("max"));
    if (value <= max) {
      return true;
    } else {
      return false;
    }
  });

  var validator = $('#clear-form').validate({
    rules: { 
      lender: "required",
      amount: {
        required: true,
        number: true,
        maxClear: true
      }
    },
    errorElkement: "span",
    errorPlacement: function (error, element) {
      var labelElement = $(element).prev('label');
      error.insertAfter(labelElement);
    },
    messages: {
      lender: "You must select a person to pay.",
      amount: {
        required: "You must enter a number.",
        number: "You must enter a valid number.",
        maxClear: "You can not pay back more than you owe."
      }    
    }
  });

  if(validator.form()){
    $('#clear-form').submit();
  }
}
