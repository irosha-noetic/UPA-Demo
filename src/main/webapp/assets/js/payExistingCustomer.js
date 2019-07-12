$(function() {

    var cardRef = $('#cardReference');
    var customerRef = $('#customerRef');
    var orderId = $('#orderId');
	var cvn = $('#cvn');
	var amount = $('#amount');


    $("#register-Btn").click(function(e) {

        e.preventDefault();
		const url = 'https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/elavon/payBySavedCard';
	
		var data = {
	      
				"paymentProvider":"ELAVON_REALEX",
				"systemId":"30",
				"payerReference":customerRef.val(),
				"cardReference":cardRef.val(),
				"orderId":orderId.val(),
				"autoSettleFlag":"1",
				"cvn":cvn.val(),
				"amount":amount.val(),
				"currencyCode":"GBP",
				"dccDetails":null
			}


		$.ajax({
			type: "POST",
			url:url,
			dataType: "json",
			contentType: "application/json",
			
			    headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en", "X-Authorisation":"2FDD8051D3B620FACD224395FE8B866C50DB1EAB"},
				
			
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