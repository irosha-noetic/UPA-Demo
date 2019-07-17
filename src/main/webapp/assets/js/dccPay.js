$(function() {
 
	var selectedPaymentOption = null;

	var search = location.search.substring(1);
	var result = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

	var orderId = result.orderId;
	var cardType = result.cardType;
	var cardNumber = result.cardNumber;
	var expDate = result.expiryDate;
	var cardHolderName = result.cardHolderName;
	var cvv = result.cvv;
	var chAmount = result.chAmount;
	var merAmount = result.merAmount;
	var chCurrency = result.chCurrency;
	var merCurrency = result.merCurrency;
	var dccRate = result.dccRate; 

	$('#cardHolderAmount').text(result.chAmount);
	$('#merchantAmount').text(result.merAmount);
	$('#cardHolderCurrency').text(result.chCurrency);
	$('#merchantCurrency').text(result.merCurrency);

	// Get the modal
	var modal = $("#myModal");

	// Get the <span> element that closes the modal
	var span = $('.close')[0];

	// When the user clicks on <span> (x), close the modal

	$("#dccOption").click(function(){

		selectedPaymentOption = "dccPayment";
		alert(selectedPaymentOption);
	  
	}); 

	$("#nonDccOption").click(function(){

		selectedPaymentOption = "nonDccPayment";
		alert(selectedPaymentOption);
	  
	});


	span.onclick = function() {
	  //modal.style.display = "none";
	  modal.css("display","none");
	}

	$("#submitForm").click(function(){

		var pburl = "https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/pb/termUrl"; 
		var PaRes = $('input[name=PaRes]').val();
		var MD = $('input[name=MD]').val();

			$.ajax({
				type: "POST",
				url:pburl,
				contentType: "application/x-www-form-urlencoded",
				data: jQuery.param({ PaRes: PaRes, MD : MD}),
				
				success: function (data, textStatus, jQxhr) {
					console.log(data);
					alert("Payment Successful: "+data.payload.message);
					modal.css("display","none");
					window.location.replace("http://localhost:8085/cardPayments");
				

				},
				error: function (jqXhr, textStatus, errorThrown) {
					console.log(errorThrown);
					alert(textStatus);
				}
			});
	  
	}); 


	$('form[name=postPAResToMPIForm]').submit(function(event) {
  
  		event.preventDefault();

		alert("Handler for .submit() called.");
		var pburl = "https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/pb/termUrl"; 
		var PaRes = $('input[name=PaRes]').val();
		var MD = $('input[name=MD]').val();

		$.ajax({
			type: "POST",
			url:pburl,
			contentType: "application/x-www-form-urlencoded",
			data: jQuery.param({ PaRes: PaRes, MD : MD}),
			
			success: function (data, textStatus, jQxhr) {
				console.log(data);
				alert(data.payload.message);
				modal.css("display","none");
			
			},
			error: function (jqXhr, textStatus, errorThrown) {
				console.log(errorThrown);
				alert(jqXhr.responseJSON.message.message);
			}
	});

});


function verify3dSecureEnrollment() {

    const url = 'https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/elavon/verifyEnrolled3dSecure';

    var data = {
			    
				"paymentProvider":"ELAVON_REALEX",
				"systemId":"7",
				"key":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144",
				"orderId":orderId,
				"amount":merAmount,
				"currencyCode":merCurrency,
				"cardDetails":
					{
					    "cardType":cardType,
					    "cardNumber":cardNumber,
				        "expiryDate":expDate,
					    "cardHolderName":cardHolderName
					}
				}


    return $.ajax({
					type: "POST",
					url:url,
					crossDomain: true,
					async:true,
					dataType: "json",
					contentType: "application/json",
					headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en","X-Authorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144"},
					
					data: JSON.stringify(data),
					
					success: function (data, textStatus, jQxhr) {
						console.log(data);
						return data.message.message;

					},
					error: function (jqXhr, textStatus, errorThrown) {
						console.log(errorThrown);
						alert("verify 3dSecure Enrollment failed : "+jqXhr.responseJSON.message.message);
					}
		});
}



	$("#payNow").click(function(){

		const url = 'https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/elavon/acs';

		if(selectedPaymentOption == null || selectedPaymentOption == ""){
	       		alert("Please select a payment option");
		} else {
			if(selectedPaymentOption =="dccPayment"){


					$.when(verify3dSecureEnrollment()).done(function(data){
					   
					   if(data.message.message =="Enrolled"){

					   		alert("This card is Enrolled for 3dSecure Payment");

							var data1 ={
									
									    "acsUrl": data.payload.acsUrl,
									    "pareq": data.payload.payerAuthReq,
									    "termUrl":"https://dev-upa-api.wearenoetic.com/upa-api/v1/upa/pb/termUrl",
									    "merchantData":
									    {
										    "xAuthorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144",
										    "paymentProvider":"ELAVON_REALEX",
										    "systemId":"7",
											"orderId": orderId,
										    "cvn": cvv,
										    "cvnPresenceIndicator": "1",
										    "amount": merAmount,
										    "currencyCode": merCurrency,
										    "autoSettleFlag": "0",
										    "cardDetails":
												{
												    "cardType":cardType,
												    "cardNumber":cardNumber,
											            "expiryDate":expDate,
												    "cardHolderName":cardHolderName
												},
									
											"dccDetails": 
												{
												    "currencyConversionProcessor": "fexco",
												    "dccAmount": chAmount,
												    "dccCurrencyCode": chCurrency,
												    "dccRate": dccRate,
												    "dccRateType": "S"
										  		}
										}
									}

							$.ajax({
								type: "POST",
								url:url,
								crossDomain: true,
								async:true,
								dataType: "json",
								contentType: "application/json",
								headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en","X-Authorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144"},
								
								data: JSON.stringify(data1),
								
								success: function (data, textStatus, jQxhr) {
									console.log(data);
									alert("Acs request : "+data.message.message);


									$('#myModal').find('.modal-body').html(data.payload);


									modal.css("display","block");
									$('#submit').hide();
									
									

								},
								error: function (jqXhr, textStatus, errorThrown) {
									console.log(errorThrown);
									alert(jqXhr.responseJSON.message.message);
								}
							});


						}else{

							alert("This card is not Enrolled for 3dSecure Payment or 3dSecure enrollment check failed. Proceed with the normal payment");

								var data = {
									"paymentProvider":"ELAVON_REALEX",
									"systemId":"7",
									"orderId":orderId,
									"amount":merAmount,
									"currencyCode":merCurrency,
									"cvn":cvv,
									"cvnPresenceIndicator":"1",
									"autoSettleFlag":"0",
									"cardDetails":
										{
										    "cardType":cardType,
										    "cardNumber":cardNumber,
									            "expiryDate":expDate,
										    "cardHolderName":cardHolderName
										},
									
									"dccDetails": 
										{
										    "currencyConversionProcessor": "fexco",
										    "dccAmount": chAmount,
										    "dccCurrencyCode": chCurrency,
										    "dccRate": dccRate,
										    "dccRateType": "S"
								  		}
								}

							$.ajax({
								type: "POST",
								url:url,
								crossDomain: true,
								async:true,
								dataType: "json",
								contentType: "application/json",
								xhrFields: {
									withCredentials: false
								    },
								    headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en","X-Authorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144"},
								
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
						}
					});
	

			}else{
				
				var data = {
					     
							"paymentProvider":"ELAVON_REALEX",
							"systemId":"7",
							"orderId":orderId,
							"amount":merAmount,
							"currencyCode":merCurrency,
							"cvn":cvv,
							"cvnPresenceIndicator":"1",
							"autoSettleFlag":"0",
							"cardDetails":
								{
								    "cardType":cardType,
								    "cardNumber":cardNumber,
							            "expiryDate":expDate,
								    "cardHolderName":cardHolderName
								},
							
							"dccDetails": 
								{
								    "currencyConversionProcessor": "fexco",
								    "dccAmount": merAmount,
								    "dccCurrencyCode": merCurrency,
								    "dccRate": 1,
								    "dccRateType": "S"
						  		}
						}

						$.ajax({
							type: "POST",
							url:url,
							crossDomain: true,
							async:true,
							dataType: "json",
							contentType: "application/json",

							headers: {"Authorization": "Basic YXBpQG5vZXRpYzp1cGE4MTJlMjc2Mjk3NjM0MzBjOTU2YWJlMzc0MWFiYmNiMGU=","lang":"en","X-Authorisation":"DE3DABCC0457F2847BD722E92A483B2BFCFBF144"},
							
							data: JSON.stringify(data),
							
							success: function (data, textStatus, jQxhr) {
								console.log(data);
								alert("Payment successful : "+data.message.message);

							},
							error: function (jqXhr, textStatus, errorThrown) {
								console.log(errorThrown);
								alert(jqXhr.responseJSON.message.message);
							}
						});
			}
	  	}
	});

});







 





