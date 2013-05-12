$(document).ready(function () {
  // When selecting a new perosn set the amount-field to the total amount owed
  updateMaxValue();
  $('select').change(updateMaxValue);

  // Change , to . for numbers.
  $('[name="amount"]').keypress(function () {
    $(this).attr('value', $(this).attr('value').replace(',', '.'));
  });
});

function getOwed() {
  return parseFloat($('[name="lender"]').find(":selected").attr("max"));
}

function updateMaxValue() {
  var max = getOwed();
  if (isNaN(max)) {
    max = 'You do not owe anything.';
  } 

  $('[name="amount"]').attr('value', max);
}

function submitClearForm() {
  $.validator.addMethod('maxClear', function (value, element) {
    // Want different mesage for this type of input.
    var max = getOwed();

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
        maxClear: "You can not pay back more than you owe (" + getOwed() +")"
      }    
    }
  });

  if(validator.form()){
    $('#clear-form').submit();
  }
}
