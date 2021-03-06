$(() => {
	// Ширина окна для ресайза
	WW = $(window).width()


	// Боковая колонка - Меню
	$('aside .menu .item > a.sub_link').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('open').next().slideToggle(300)
	})


	// Видео плеер
	/*if ('function' === typeof MediaPlayer) {
		[].forEach.call(document.querySelectorAll('audio[controls], video[controls]'), function (media) {
			player = media.player = new MediaPlayer(media, {
				svgs: {
					play: 'images/sprite.svg#symbol-play',
					pause: 'images/sprite.svg#symbol-pause',
					mute: 'images/sprite.svg#symbol-mute',
					unmute: 'images/sprite.svg#symbol-unmute',
					enterFullscreen: 'images/sprite.svg#symbol-enterFullscreen',
					leaveFullscreen: 'images/sprite.svg#symbol-leaveFullscreen'
				},
			})
		})

		$('.video_player .rewind_btn').click(e => {
			e.preventDefault()

			player.media.currentTime = player.media.currentTime - 15
		})

		$('.video_player .forward_btn').click(e => {
			e.preventDefault()

			player.media.currentTime = player.media.currentTime + 30
		})
	}*/


	// Тест - Поля ввода в тексте
	var input = document.querySelectorAll('.test_data .step .answers .text .input'),
		buffer = []

	for (var i = 0; input.length > i; i++) {
		buffer[i] = document.createElement('div')
		buffer[i].className = 'input_buffer'

		input[i].parentNode.insertBefore(buffer[i], input[i].nextSibling)

		input[i].oninput = function () {
			this.nextElementSibling.innerHTML = this.value
			this.style.width = this.nextElementSibling.clientWidth + 'px'
		}
	}


	// Тест - Пары
	function lineDistance(x, y, x0, y0) {
		return Math.sqrt((x -= x0) * x + (y -= y0) * y)
	}

	function line_exists(stem, option) {
		var $exists = false

		$(".line").each(function () {
			if (
				$(this).data("stem") === stem.attr("id") &&
				$(this).data("option") === option.attr("id")
			) {
				$exists = true
			}
		})

		return $exists
	}

	function drawLine(stem, option) {
		var pointA = stem.offset(),
			pointB = option.offset()

		pointA.left = pointA.left + stem.outerWidth()
		pointA.top = pointA.top + stem.outerHeight() / 2

		pointB.top = pointB.top + option.outerHeight() / 2

		var angle =
			Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left) *
			180 /
			Math.PI

		var distance = lineDistance(
			pointA.left,
			pointA.top,
			pointB.left,
			pointB.top
		)

		var line = $('<div class="line"/>')

		line.append($('<div class="point"/>'))
		line.attr("data-stem", stem.attr("id"))
		line.attr("data-option", option.attr("id"))

		$(".couples").append(line)

		line.css({
			"transform": "rotate(" + angle + "deg)",
			"width": distance + "px",
			"position": "absolute"
		})

		pointB.top > pointA.top
			? $(line).offset({ top: pointA.top, left: pointA.left })
			: $(line).offset({ top: pointB.top, left: pointA.left })
	}

	$(".stems li").on("click", function () {
		stem = $(this)

		if (!stem.hasClass("matched")) {

			stem.toggleClass("selected")

			$(".stems li")
				.not(stem)
				.removeClass("selected")

			$(".options li").removeClass("selected")

			if (stem.hasClass("selected")) {
				var stem_lines = $('.line[data-stem="' + stem.attr("id") + '"]')

				stem_lines.each(function () {
					var $option = $(this).data("option")
					$('.options li[id="' + $option + '"]').addClass("selected")
				})

				$(".options").addClass("ready")
			} else {
				$(".options").removeClass("ready")
			}
		}
	});

	$(".options li").on("click", function () {
		if ($(".options").hasClass("ready")) {
			if (!$(this).hasClass("active")) {
				$(this).toggleClass("selected")

				var stem = $(".stems li.selected"),
					option = $(this)

				if (!line_exists(stem, option)) {
					drawLine(stem, option)
				} else {
					$(
						'.line[data-stem="' +
						stem.attr("id") +
						'"][data-option="' +
						option.attr("id") +
						'"]'
					).remove()
				}

				var stem_lines = $('.line[data-stem="' + stem.attr("id") + '"]')

				stem_lines.length > 0
					? stem.addClass('matched')
					: stem.removeClass('matched')

				$(this).addClass("active");
				$(".stems li").removeClass("selected");
				$(this).removeClass("selected");
				$(".options").removeClass("ready")
			}
		}
	})


	// Тест - Перетаскивание
	sortable('.sortable')


	// Моб. меню
	$('.mob_header .menu_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .menu_btn').addClass('active')
		$('body').addClass('menu_open')
		$('aside').fadeIn(300)
	})

	$('aside .close_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .menu_btn').removeClass('active')
		$('body').removeClass('menu_open')
		$('aside').fadeOut(300)
	})


	// Квиз
	let totalSteps = $('.quiz .step').length,
		currentStep = 1

	$('.quiz .count .total').text(totalSteps)

	$('.quiz .answers label').click(function () {
		let answerText = $(this).text(),
			questionText = $(this).closest('.step').find('.question').text()

		$('.quiz .total_answers .template .question span').text(questionText)
		$('.quiz .total_answers .template .answer span').text(answerText)
		$('.quiz .total_answers .template').before($('.quiz .total_answers .template').html())

		$('.quiz .step').hide()
		$(this).closest('.step').next().fadeIn(300)

		$('.quiz .total_answers').fadeIn(300)
		$('.quiz .btns').css('display', 'flex')

		currentStep++

		if (currentStep > totalSteps) {
			$('.quiz .btns, .quiz .steps, .quiz .total_answers').hide()
			$('.quiz .result').fadeIn(300)
		} else {
			$('.quiz .count .current').text(currentStep)
		}
	})

	$('.quiz .btns .prev_btn').click(function (e) {
		e.preventDefault()

		$('.quiz .step').hide()
		$('.quiz .step').eq(currentStep - 1).prev().fadeIn(300)

		$('.quiz .total_answers .template').prev().remove()

		currentStep = currentStep - 1
		$('.quiz .count .current').text(currentStep)
	})


	// Аудио сообщения
	const audios = document.querySelectorAll('.audio_wave'),
		inits = []

	var i = 0

	audios.forEach(el => {
		inits[i] = WaveSurfer.create({
			container: el,
			waveColor: '#ABAAE2',
			progressColor: el.classList.contains('light') ? '#fff' : '#0B00D8',
			cursorColor: 'transparent',
			barWidth: 2,
			barRadius: 2,
			cursorWidth: 0,
			height: 66,
			barGap: 2
		})

		inits[i].load(el.getAttribute('data-file'))
		i++
	})

	setTimeout(() => {
		i = 0
		$('.audio_message .duration').each(function () {
			$(this).text(sec2time(inits[i].getDuration()))
			i++
		})
	}, 1000)

	i = 0
	$('.audio_message .btn').each(function () {
		$(this).attr('data-index', i)
		i++
	})

	$('.audio_message .btn').click(function () {
		let index = $(this).data('index')

		$(this).toggleClass('active')
		inits[index].playPause(inits[index])
	})


	// Диалог - Подсказка
	$('.dialog .message .prompt .yes_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active').closest('.prompt').find('.text').slideToggle(300)
	})

	$('.dialog .message .prompt .no_btn').click(function (e) {
		e.preventDefault()

		$(this).closest('.prompt').slideUp(200)
	})


	$('.dialog .image_wrap .prompt_btn').click(function (e) {
		e.preventDefault()

		$('.dialog .image_wrap .image .answer').addClass('show')
	})


	$('.dialog .image_wrap .image svg').click(function (e) {
		e.preventDefault()

		$('.dialog .image_wrap .image .answer').removeClass('success')
		$('.dialog .prompt_text, .dialog .success_text, .dialog .next_link').hide()

		$('.dialog .image_wrap .image').addClass('error')
		$('.dialog .error_text').fadeIn(300)
	})

	$('.dialog .image_wrap .image .answer').click(function (e) {
		e.stopPropagation()
		e.preventDefault()

		$('.dialog .prompt_text, .dialog .error_text').hide()

		$('.dialog .image_wrap .image').removeClass('error')
		$(this).addClass('success')
		$('.dialog .success_text').fadeIn(300)
		$('.dialog .next_link').css('display', 'flex')
	})


	// Всплывашки
	if ($('#congratulations_modal').length) {
		Fancybox.show([{
			src: '#congratulations_modal',
			type: 'inline'
		}])
	}

	if ($('#congratulations_modal2').length) {
		Fancybox.show([{
			src: '#congratulations_modal2',
			type: 'inline'
		}])
	}

	if ($('#simulator_over_modal').length) {
		Fancybox.show([{
			src: '#simulator_over_modal',
			type: 'inline'
		}])
	}

	if ($('#confirm_modal').length) {
		Fancybox.show([{
			src: '#confirm_modal',
			type: 'inline'
		}])
	}


	// Восстановление пароля
	$('.auth .recovery .form').submit(function (e) {
		e.preventDefault()

		Fancybox.show([{
			src: '#recovery_success_modal',
			type: 'inline'
		}])
	})


	$('.auth .form .view_btn').click(function (e) {
		e.preventDefault()

		let parent = $(this).closest('.field')

		!$(this).hasClass('active')
			? parent.find('.input').attr('type', 'text')
			: parent.find('.input').attr('type', 'password')

		$(this).toggleClass('active')
	})
})



$(window).on('load', () => {
	// Выравнивание элементов в сетке
	$('.courses .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--courses_count')))
	})

	$('.simulators .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--simulators_count')))
	})

	$('.articles .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--articles_count')))
	})

	$('.discussions .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--discussions_count')))
	})

	$('.polls .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--polls_count')))
	})

	$('.webinars .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--webinars_count')))
	})

	$('.podcasts .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--podcasts_count')))
	})

	$('.workbook .row').each(function () {
		namesHeight($(this), parseInt($(this).css('--workbook_count')))
	})
})



$(window).on('resize', () => {
	if (typeof WW !== 'undefined' && WW != $(window).width()) {
		// Моб. версия
		if (!fiestResize) {
			$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1')
			if ($(window).width() < 375) $('meta[name=viewport]').attr('content', 'width=375, user-scalable=no')

			fiestResize = true
		} else {
			fiestResize = false
		}


		// Выравнивание элементов в сетке
		$('.courses .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--courses_count')))
		})

		$('.simulators .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--simulators_count')))
		})

		$('.articles .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--articles_count')))
		})

		$('.discussions .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--discussions_count')))
		})

		$('.polls .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--polls_count')))
		})

		$('.webinars .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--webinars_count')))
		})

		$('.podcasts .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--podcasts_count')))
		})

		$('.workbook .row').each(function () {
			namesHeight($(this), parseInt($(this).css('--workbook_count')))
		})


		// Перезапись ширины окна
		WW = $(window).width()
	}
})



// Выравнивание заголовокв
function namesHeight(context, step) {
	let start = 0,
		finish = step,
		$items = context.find('> *')

	$items.find('.name, .desc').height('auto')

	$items.each(function () {
		setHeight($items.slice(start, finish).find('.name'))
		setHeight($items.slice(start, finish).find('.desc'))

		start = start + step
		finish = finish + step
	})
}


function sec2time(timeInSeconds) {
	let pad = (num, size) => ('000' + num).slice(size * -1),
		time = parseFloat(timeInSeconds).toFixed(3),
		// hours = Math.floor(time / 60 / 60),
		minutes = Math.floor(time / 60) % 60,
		seconds = Math.floor(time - minutes * 60)

	return pad(minutes, 2) + ':' + pad(seconds, 2);
}