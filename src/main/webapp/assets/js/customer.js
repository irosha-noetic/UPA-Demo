$(function() {

    var title = $('#title');
    var firstName = $('#firstName');
    var sirName = $('#sirName');
    var email = $('#email');
    var company = $('#company');
    var customerRef = $('#customerRef');
    var orderId = $('#orderId');
    var customerType = $('#customerType');
    var mobileNo = $('#mobileNo');



    $("#registerBtn").click(function(e) {

        e.preventDefault();
		const url = 'https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/elavon/customer';
	
		var data = {
					"paymentProvider":"ELAVON_REALEX",
					"systemId":"30",
					"customerRef":customerRef.val(),
					"orderId":orderId.val(),
					"customerType":customerType.val(),
					"title":title.val(),
					"firstName":firstName.val(),
					"surname":sirName.val(),
					"company":company.val(),
					"mobilePhoneNumber":mobileNo.val(),
					"email":email.val(),
					"comment1":"Test",
					"comment2":"test test"
					}

		$.ajax({
			type: "POST",
			url:url,
			crossDomain: true,
			async:true,
			dataType: "json",
			contentType: "application/json",
			headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en","X-Authorisation":"2FDD8051D3B620FACD224395FE8B866C50DB1EAB"},
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