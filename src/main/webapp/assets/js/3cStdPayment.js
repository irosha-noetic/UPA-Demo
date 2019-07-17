$(function() {

    var owner = $('#owner');
    var cardNumber = $('#cardNumber');
    var cardNumberField = $('#card-number-field');
    var CVV = $("#cvv");
    var mastercard = $("#mastercard");
    var confirmButton = $('#confirm-purchase');
    var visa = $("#visa");
    var amex = $("#amex");
    var cardType;
    var orderId = $('#order-Id');
    var amount = $('#payAmount');

   	var search = location.search.substring(1);
	var result = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	var nAmount = result.amount;
	$("#payAmount").val(nAmount);

	$('.alert').hide();
	
    // Use the payform library to format and validate
    // the payment fields.

    cardNumber.payform('formatCardNumber');
    CVV.payform('formatCardCVC');


    cardNumber.keyup(function() {

        amex.removeClass('transparent');
        visa.removeClass('transparent');
        mastercard.removeClass('transparent');

        if ($.payform.validateCardNumber(cardNumber.val()) == false) {
            cardNumberField.addClass('has-error');
        } else {
            cardNumberField.removeClass('has-error');
            cardNumberField.addClass('has-success');
        }

        if ($.payform.parseCardType(cardNumber.val()) == 'visa') {
            mastercard.addClass('transparent');
            amex.addClass('transparent');
	    cardType = 'visa';
        } else if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
            mastercard.addClass('transparent');
            visa.addClass('transparent');
	    cardType = 'amex';
        } else if ($.payform.parseCardType(cardNumber.val()) == 'mastercard') {
            amex.addClass('transparent');
            visa.addClass('transparent');
	    cardType = 'mastercard';
        }
    });


    confirmButton.click(function(e) {

        e.preventDefault();

        var isCardValid = $.payform.validateCardNumber(cardNumber.val());
        var isCvvValid = $.payform.validateCardCVC(CVV.val());
        var expMonth = $("#exp-month").find(":selected").val();
		var expYear = $("#exp-year").find(":selected").val();
		var expDate = expMonth+expYear;

		const url = 'https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/threec/pay';
	

        if(owner.val().length < 5){
            alert("Wrong owner name");
        } else if (!isCardValid) {
            alert("Wrong card number");
        } else if (!isCvvValid) {
            alert("Wrong CVV");
        } else {

		var data = {
			"paymentProvider":"3C_WEB2PAY",
			"systemId":"5",
			"cvn":CVV.val(),
			"cvnPresenceIndicator":"1",
			"payerReference":"ir",
			"amount":amount.val(),
			"autoSettleFlag":"0",
			"currencyCode":"GBP",
			"orderId":orderId.val(),
			"cardDetails":
			{
				"cardType":cardType,
				"cardNumber":cardNumber.val().replace(/\s/g,''),
				"expiryDate":expDate,
				"cardHolderName":owner.val()
			}
		}

		$.ajax({
			type: "POST",
			url:url,
			crossDomain: true,
			async:true,
			dataType: "json",
			contentType: "application/json",

			headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en", "X-Authorisation":"848BF363C6C0FE36EC0AE6C9D76FEA6E97526F92"},
			
			data: JSON.stringify(data),
			
			success: function (data, textStatus, jQxhr) {
				console.log(data);
				if(data.httpCode=="200" || data.httpCode == null){
			
					$('.alert-danger').hide();
					$('.alert-success').show();
					$(".alert-success").delay(200).addClass("in").fadeOut(5000);
					
				}else{
					$('.alert-danger').text(data.message.message);
					$('.alert-success').hide();
					$('.alert-danger').show();
					$(".alert-danger").delay(200).addClass("in").fadeOut(5000);
				}
				
				//alert(data.message.message);

			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
				$('.alert-danger').text(jqXhr.responseJSON.message.message);
				$('.alert-danger').show();
				$(".alert-danger").delay(200).addClass("in").fadeOut(5000);
				//alert(textStatus);
			}
		});

        }
    });
});