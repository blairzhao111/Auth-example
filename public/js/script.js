
(function($){
	var $username = $('#regName'),
		$ps1 = $('#ps1'),
		$ps2 = $('#ps2'),
		$regForm = $('#regForm');
		$alert = $regForm.children('div.alert-danger');

	$username.on('blur', function(){
		var $this = $(this),
			input = $this.val();

		input = $.trim(input);

		$.ajax({
			method: "Get",
			url: "/api/username/" + input,
			dataType: "json",
			success: function(result){
				var $wrapperDiv = $this.closest('.form-group');
				
				$wrapperDiv.removeClass('has-feedback').removeClass('has-error').removeClass('has-success');
				$wrapperDiv.find('.glyphicon').remove();					

				if(!result.available){
					$wrapperDiv.addClass('has-error').addClass('has-feedback');;
					$('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').insertAfter($this);
				}else{
					$wrapperDiv.addClass('has-success').addClass('has-feedback');
					$('<span class="glyphicon glyphicon-ok form-control-feedback"></span>').insertAfter($this);
				}
			}
		});
	});

	$ps1.on('blur', function(){
		var $this = $(this),
			$wrapperDiv = $this.closest('.form-group');

		if(!$this.val()){
			return false;
		}

		$wrapperDiv.addClass('has-success').addClass('has-feedback');
		$('<span class="glyphicon glyphicon-ok form-control-feedback"></span>').insertAfter($this);
	});

	$ps2.on('blur', function(){
		var $this = $(this),
			$wrapperDiv = $this.closest('.form-group');

		if(!$ps1.val()){
			if($this.val()){
				$wrapperDiv.addClass('has-error').addClass('has-feedback');;
				$('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').insertAfter($this)					
			}else{
				return;
			}
		}

		$wrapperDiv.removeClass('has-feedback').removeClass('has-error').removeClass('has-success');
		$wrapperDiv.find('.glyphicon').remove();	

		if($this.val() === $ps1.val()){
			$wrapperDiv.addClass('has-success').addClass('has-feedback');
			$('<span class="glyphicon glyphicon-ok form-control-feedback"></span>').insertAfter($this);			
		}else{
			$wrapperDiv.addClass('has-error').addClass('has-feedback');;
			$('<span class="glyphicon glyphicon-remove form-control-feedback"></span>').insertAfter($this)			
		}

	});

	$regForm.on('submit', function(event){
		var $this = $(this),
			$divs = $this.children('div.form-group'),
			result = true;


		$divs.each(function(){
			result = result && $(this).hasClass('has-success');
			console.log(result);
		});	

		if(!result){
			event.preventDefault();

			if($alert.length){
				$alert.find('strong').text("Oops, looks like something is wrong...");
			}else{
				$alert = $('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops, looks like something is wrong...</strong>');
				$this.prepend($alert);
			}
		}
	});

})(jQuery)