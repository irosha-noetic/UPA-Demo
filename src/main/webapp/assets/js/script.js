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

	const url = 'http://localhost:8080/upa-api/v1/upa/elavon/currencyQuote';
	

        if(owner.val().length < 5){
            alert("Wrong owner name");
        } else if (!isCardValid) {
            alert("Wrong card number");
        } else if (!isCvvValid) {
            alert("Wrong CVV");
        } else {


		var data = {
				"paymentProvider":"ELAVON_REALEX",
				"systemId":"7",
				"key":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144",
				"orderId":orderId.val(),
				"amount":amount.val(),
				"currencyCode":"GBP",
				"cardDetails":
					{
						"cardType":cardType,
						"cardNumber":cardNumber.val().replace(/\s/g,''),
						"expiryDate":expDate,
						"cardHolderName":owner.val()
					},
			"rateType":"S"
		}
	   


		$.ajax({
			type: "POST",
			url:url,
			crossDomain: true,
			async:true,
			dataType: "json",
			contentType: "application/json",
		
			headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGFlMWZlMjJhODAxODY0NjVhYmMwZjY5MzhlOGQ1YWM5OGU=","lang":"en", "X-Authorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144"},
			
			data: JSON.stringify(data),
			
			success: function (data, textStatus, jQxhr) {
				console.log(data);
				var result = {orderId: orderId.val(), cardType: cardType, cardNumber: cardNumber.val().replace(/\s/g,''), cvv: CVV.val(), expiryDate: expDate, cardHolderName: owner.val(), chAmount: data.payload.cardHolderAmount, chCurrency: data.payload.cardHolderCurrencyCode,merAmount: data.payload.merchantAmount, merCurrency: data.payload.merchantCurrency, dccRate:  data.payload.cardHolderRate}
				window.location.href='dcc.html?'+$.param(result);

			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
				alert(jqXhr.responseJSON.message.message);
			}
		});

        }
    });
});

