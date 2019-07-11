$(function() {

    var cardRef = $('#cardReference');
    var cardType = $('#cardType');
    var cardNumber = $('#cardNumber');
    var expDate = $('#expDate');
    var cardHolderName = $('#cardHolderName');
    var customerRef = $('#customerRef');
    var orderId = $('#orderId');



    $("#register-Btn").click(function(e) {

        e.preventDefault();
		const url = 'http://localhost:8080/upa-api/v1/upa/elavon/paymentMethod';
	
		var data = {
					"paymentProvider":"ELAVON_REALEX",
					"systemId":"30",
					"customerRef":customerRef.val(),
					"cardRef":cardRef.val(),
					"orderId":orderId.val(),
					"cardDetails":
						{
							"cardType":cardType.val(),
							"cardNumber":cardNumber.val(),
							"expiryDate":expDate.val(),
							"cardHolderName":cardHolderName.val()
						}
			}
		$.ajax({
			type: "POST",
			url:url,
			crossDomain: true,
			async:true,
			dataType: "json",
			contentType: "application/json",
			headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGFlMWZlMjJhODAxODY0NjVhYmMwZjY5MzhlOGQ1YWM5OGU=","lang":"en", "X-Authorisation":"2FDD8051D3B620FACD224395FE8B866C50DB1EAB"},
			
			data: JSON.stringify(data),
			
			success: function (data, textStatus, jQxhr) {
				console.log(data);
				alert(data.message.message);

			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
				alert(jqXhr.responseJSON.message.message);
			}
		});

    });
});